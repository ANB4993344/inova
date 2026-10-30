const requestWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestHistory = new Map();

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function readField(data, key, maxBytes) {
  if (typeof data[key] !== "string") {
    return null;
  }
  const value = data[key].trim();
  if (Buffer.byteLength(value, "utf8") > maxBytes || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    return null;
  }
  return value;
}

function isRateLimited(ipAddress) {
  const now = Date.now();
  const recentRequests = (requestHistory.get(ipAddress) ?? [])
    .filter((timestamp) => timestamp > now - requestWindowMs);

  if (recentRequests.length >= maxRequestsPerWindow) {
    requestHistory.set(ipAddress, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestHistory.set(ipAddress, recentRequests);
  return false;
}

export default async (request) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Méthode non autorisée." });
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(requestUrl.hostname)) {
    return jsonResponse(403, { error: "Le formulaire est disponible uniquement sur une connexion sécurisée HTTPS." });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== requestUrl.origin) {
        return jsonResponse(403, { error: "Origine de la demande non autorisée." });
      }
    } catch {
      return jsonResponse(403, { error: "Origine de la demande non autorisée." });
    }
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse(415, { error: "Format de demande non accepté." });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 4096) {
    return jsonResponse(413, { error: "La demande est vide ou trop volumineuse." });
  }

  let rawBody;
  try {
    rawBody = await request.text();
  } catch (error) {
    console.error("Inova contact form: could not read request body.", error);
    return jsonResponse(400, { error: "Les informations envoyées sont invalides." });
  }

  if (Buffer.byteLength(rawBody, "utf8") < 1 || Buffer.byteLength(rawBody, "utf8") > 4096) {
    return jsonResponse(413, { error: "La demande est vide ou trop volumineuse." });
  }

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: "Les informations envoyées sont invalides." });
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return jsonResponse(400, { error: "Les informations envoyées sont invalides." });
  }

  const lastName = readField(data, "lastName", 160);
  const firstName = readField(data, "firstName", 160);
  const email = readField(data, "email", 254);
  const phone = readField(data, "phone", 40);
  const message = readField(data, "message", 2000);
  const digitsInPhone = phone?.replace(/\D/g, "").length ?? 0;

  if (
    !lastName ||
    !firstName ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    !/^[0-9+().\s-]{6,40}$/.test(phone) ||
    digitsInPhone < 6 ||
    message === null ||
    data.consent !== true
  ) {
    return jsonResponse(422, { error: "Vérifiez les champs obligatoires et votre consentement." });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (
    !botToken ||
    !/^\d{6,12}:[A-Za-z0-9_-]{20,}$/.test(botToken) ||
    !chatId ||
    !/^-?\d{5,20}$/.test(chatId)
  ) {
    console.error("Inova contact form: Telegram credentials are not configured.");
    return jsonResponse(503, { error: "Le service de contact n’est pas encore configuré. Réessayez plus tard ou contactez Inova par e-mail." });
  }

  const clientIp = request.headers.get("x-nf-client-connection-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  if (isRateLimited(clientIp)) {
    return jsonResponse(429, { error: "Trop de tentatives. Veuillez réessayer dans quelques minutes." });
  }

  const text = [
    "Nouvelle demande de contact — Inova",
    `Nom : ${lastName}`,
    `Prénom : ${firstName}`,
    `E-mail : ${email}`,
    `Téléphone : ${phone}`,
    `Projet : ${message || "Non précisé"}`,
    "Consentement au traitement : Oui",
  ].join("\n");

  let telegramResponse;
  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error("Inova contact form: Telegram request failed.", error);
    return jsonResponse(502, { error: "La transmission a échoué. Vérifiez votre connexion puis réessayez." });
  }

  let telegramResult;
  try {
    telegramResult = await telegramResponse.json();
  } catch (error) {
    console.error("Inova contact form: Telegram returned an invalid response.", error);
    return jsonResponse(502, { error: "La transmission a échoué. Vérifiez les informations puis réessayez." });
  }

  if (!telegramResponse.ok || telegramResult?.ok !== true) {
    console.error(`Inova contact form: Telegram returned HTTP ${telegramResponse.status}.`);
    return jsonResponse(502, { error: "La transmission a échoué. Vérifiez les informations puis réessayez." });
  }

  return jsonResponse(200, { ok: true });
};
