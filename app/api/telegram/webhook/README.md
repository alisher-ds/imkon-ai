# Telegram webhook

Set `TELEGRAM_BOT_TOKEN` in the deployment environment, then point Telegram to:

`https://YOUR-DOMAIN/api/telegram/webhook`

Set webhook with:

`https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR-DOMAIN/api/telegram/webhook`

The endpoint is intentionally server-side so the bot token is never exposed to the browser.
