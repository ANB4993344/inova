CONFIGURATION TELEGRAM — INOVA

1. Sur le serveur HTTPS d’Inova, dans ce dossier private, copiez
   telegram-config.php.example vers telegram-config.php.
2. Créez un bot privé dans Telegram avec BotFather et renseignez son jeton
   dans bot_token. Renseignez dans chat_id l’identifiant du compte ou groupe
   privé qui doit recevoir les demandes.
3. Envoyez un premier message au bot ou ajoutez-le au groupe privé. Vérifiez
   que le compte destinataire est celui d’Inova et que seuls les membres
   autorisés peuvent lire les demandes.
4. Protégez le jeton et le chat ID : ne les publiez pas, ne les ajoutez pas
   au site public et ne les envoyez pas dans une conversation.
5. Vérifiez sur l’hébergement que private/.htaccess est présent et que
   l’accès HTTP au dossier private est refusé. Testez le formulaire après
   activation du certificat HTTPS.

Tant que telegram-config.php ne contient pas les véritables identifiants,
le serveur refuse les envois et le formulaire affiche un message d’erreur.
