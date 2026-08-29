// api/telegram.js

export default async function handler(req, res) {
    // Enable CORS for frontend interaction
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, isLead } = req.body;
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!text) {
            return res.status(400).json({ error: 'Missing text content' });
        }

        if (!botToken || !chatId) {
            return res.status(500).json({ error: 'Server variables not configured' });
        }

        // 1. Send Telegram Alert
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        let telegramSuccess = response.ok;
        let telegramErrorMsg = telegramSuccess ? null : (data.description || 'Telegram API error');

        // 2. Send Backup Email Alert (Resend API)
        const resendApiKey = process.env.RESEND_API_KEY;
        const emailRecipient = process.env.LEAD_EMAIL_RECIPIENT;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        const shouldSendEmail = isLead || (text && text.includes('NEW VERIFIED LEAD'));

        if (shouldSendEmail && resendApiKey && emailRecipient) {
            try {
                const htmlContent = text
                    .replace(/\n/g, '<br>')
                    .replace(/\*(.*?)\*/g, '<strong>$1</strong>');

                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${resendApiKey}`
                    },
                    body: JSON.stringify({
                        from: `Glasgow Drive Connect <${fromEmail}>`,
                        to: [emailRecipient],
                        subject: 'New Verified Lead - Glasgow Drive Connect',
                        html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333;">${htmlContent}</div>`
                    })
                });
                console.log('Resend email sent successfully');
            } catch (emailError) {
                console.error('Failed to send lead backup email:', emailError);
            }
        }

        if (!telegramSuccess) {
            return res.status(response.status).json({ error: telegramErrorMsg });
        }

        return res.status(200).json({ success: true, messageId: data.result?.message_id });
    } catch (error) {
        console.error('Error sending Telegram alert:', error);
        return res.status(500).json({ error: error.message });
    }
}
