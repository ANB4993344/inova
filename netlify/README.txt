CONFIGURATION DU FORMULAIRE TELEGRAM SUR NETLIFY

1. Dans le tableau de bord Netlify, ouvrez le site Inova, puis Site configuration
   > Environment variables.
2. Ajoutez TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID pour le contexte de production.
   Le jeton du bot et le chat ID doivent être configurés uniquement comme variables
   d’environnement Netlify, jamais dans les fichiers du site.
3. Vérifiez que la publication du site inclut le dossier netlify/functions.
   La fonction contact.mjs fournit l’endpoint /.netlify/functions/contact.
4. Relancez un déploiement après l’ajout des variables.
5. Testez le formulaire sur l’adresse HTTPS du site et vérifiez que le message arrive
   dans la conversation privée Telegram prévue.

Le code conserve une limite de cinq tentatives par quinze minutes et par IP au mieux
sur chaque instance de fonction. Les instances serverless n’ayant pas de stockage
partagé, cette limite en mémoire ne constitue pas un anti-abus global.
