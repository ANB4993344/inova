<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Méthode non autorisée.']);
}

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === '' || $_SERVER['HTTPS'] === 'off') {
    respond(403, ['error' => 'Le formulaire est disponible uniquement sur une connexion sécurisée HTTPS.']);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, ['error' => 'Format de demande non accepté.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength < 1 || $contentLength > 4096) {
    respond(413, ['error' => 'La demande est vide ou trop volumineuse.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $requestHost = parse_url('https://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
    if (!$originHost || !$requestHost || strcasecmp($originHost, $requestHost) !== 0) {
        respond(403, ['error' => 'Origine de la demande non autorisée.']);
    }
}

$rawBody = file_get_contents('php://input');
try {
    $data = json_decode($rawBody, true, 16, JSON_THROW_ON_ERROR);
} catch (JsonException $error) {
    respond(400, ['error' => 'Les informations envoyées sont invalides.']);
}

if (!is_array($data)) {
    respond(400, ['error' => 'Les informations envoyées sont invalides.']);
}

$readField = static function (array $source, string $key, int $maxBytes): ?string {
    if (!isset($source[$key]) || !is_string($source[$key])) {
        return null;
    }
    $value = trim($source[$key]);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', ' ', $value);
    if (!is_string($value) || strlen($value) > $maxBytes) {
        return null;
    }
    return $value;
};

$lastName = $readField($data, 'lastName', 160);
$firstName = $readField($data, 'firstName', 160);
$email = $readField($data, 'email', 254);
$phone = $readField($data, 'phone', 40);
$message = $readField($data, 'message', 2000);

if (
    $lastName === null || $lastName === '' ||
    $firstName === null || $firstName === '' ||
    $email === null || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    $phone === null || !preg_match('/^[0-9+().\s-]{6,40}$/', $phone) ||
    preg_match_all('/\d/', $phone) < 6 ||
    $message === null ||
    ($data['consent'] ?? false) !== true
) {
    respond(422, ['error' => 'Vérifiez les champs obligatoires et votre consentement.']);
}

$config = [];
$configPath = __DIR__ . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'telegram-config.php';
if (is_file($configPath)) {
    $loadedConfig = require $configPath;
    if (is_array($loadedConfig)) {
        $config = $loadedConfig;
    }
}

$botToken = $config['bot_token'] ?? getenv('TELEGRAM_BOT_TOKEN');
$chatId = $config['chat_id'] ?? getenv('TELEGRAM_CHAT_ID');
if (
    !is_string($botToken) || !preg_match('/^\d{6,12}:[A-Za-z0-9_-]{20,}$/', $botToken) ||
    !is_string($chatId) || !preg_match('/^-?\d{5,20}$/', $chatId)
) {
    error_log('Inova contact form: Telegram credentials are not configured.');
    respond(503, ['error' => 'Le service de contact n’est pas encore configuré. Réessayez plus tard ou contactez Inova par e-mail.']);
}

if (!function_exists('curl_init')) {
    error_log('Inova contact form: PHP cURL extension is unavailable.');
    respond(503, ['error' => 'Le service de contact est temporairement indisponible. Réessayez plus tard.']);
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'inova-contact-' . hash('sha256', $clientIp) . '.json';
$rateLimitFile = @fopen($rateLimitPath, 'c+');
if ($rateLimitFile === false) {
    error_log('Inova contact form: could not open rate-limit storage.');
    respond(503, ['error' => 'Le service de contact est temporairement indisponible. Réessayez plus tard.']);
}

if (!flock($rateLimitFile, LOCK_EX)) {
    fclose($rateLimitFile);
    error_log('Inova contact form: could not lock rate-limit storage.');
    respond(503, ['error' => 'Le service de contact est temporairement indisponible. Réessayez plus tard.']);
}

$storedRequests = stream_get_contents($rateLimitFile);
$requestTimes = json_decode($storedRequests === false ? '' : $storedRequests, true);
$requestTimes = is_array($requestTimes) ? $requestTimes : [];
$now = time();
$requestTimes = array_values(array_filter(
    $requestTimes,
    static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $now - 900
));

if (count($requestTimes) >= 5) {
    flock($rateLimitFile, LOCK_UN);
    fclose($rateLimitFile);
    respond(429, ['error' => 'Trop de tentatives. Veuillez réessayer dans quelques minutes.']);
}

$requestTimes[] = $now;
rewind($rateLimitFile);
if (!ftruncate($rateLimitFile, 0) || fwrite($rateLimitFile, json_encode($requestTimes)) === false) {
    flock($rateLimitFile, LOCK_UN);
    fclose($rateLimitFile);
    error_log('Inova contact form: could not update rate-limit storage.');
    respond(503, ['error' => 'Le service de contact est temporairement indisponible. Réessayez plus tard.']);
}
fflush($rateLimitFile);
@chmod($rateLimitPath, 0600);
flock($rateLimitFile, LOCK_UN);
fclose($rateLimitFile);

$telegramMessage = implode("\n", [
    'Nouvelle demande de contact — Inova',
    'Nom : ' . $lastName,
    'Prénom : ' . $firstName,
    'E-mail : ' . $email,
    'Téléphone : ' . $phone,
    'Projet : ' . ($message !== '' ? $message : 'Non précisé'),
]);

$telegramUrl = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
$curl = curl_init($telegramUrl);
if ($curl === false) {
    error_log('Inova contact form: could not initialize Telegram request.');
    respond(503, ['error' => 'Le service de contact est temporairement indisponible. Réessayez plus tard.']);
}

curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'chat_id' => $chatId,
        'text' => $telegramMessage,
        'disable_web_page_preview' => true,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
]);

$telegramResponse = curl_exec($curl);
$curlError = curl_error($curl);
$httpStatus = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($telegramResponse === false) {
    error_log('Inova contact form: Telegram request failed: ' . $curlError);
    respond(502, ['error' => 'La transmission a échoué. Vérifiez votre connexion puis réessayez.']);
}

$telegramResult = json_decode($telegramResponse, true);
if ($httpStatus < 200 || $httpStatus >= 300 || !is_array($telegramResult) || ($telegramResult['ok'] ?? false) !== true) {
    error_log('Inova contact form: Telegram returned HTTP ' . $httpStatus . '.');
    respond(502, ['error' => 'La transmission a échoué. Vérifiez les informations puis réessayez.']);
}

respond(200, ['ok' => true]);
