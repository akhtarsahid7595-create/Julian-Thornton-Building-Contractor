// netlify/functions/telegram.js

exports.handler = async function(event, context) {
    // Enable CORS for frontend interaction
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers, 
            body: JSON.stringify({ error: 'Method not allowed' }) 
        };
    }

    try {
        const { text, isLead } = JSON.parse(event.body);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!text) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing text content' }) 
            };
        }

        if (!botToken || !chatId) {
            return { 
                statusCode: 500, 
                headers, 
                body: JSON.stringify({ error: 'Server variables not configured' }) 
            };
        }

        // Fallback fetch import if not available globally (older Node environments)
        const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

        // 1. Send Telegram Alert
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetchFn(telegramUrl, {
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

                await fetchFn('https://api.resend.com/emails', {
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
            return { 
                statusCode: response.status, 
                headers, 
                body: JSON.stringify({ error: telegramErrorMsg }) 
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, messageId: data.result?.message_id })
        };
    } catch (error) {
        console.error('Error sending Telegram alert:', error);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
