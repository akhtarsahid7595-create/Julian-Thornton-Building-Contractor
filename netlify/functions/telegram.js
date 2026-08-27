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
        const { text } = JSON.parse(event.body);
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

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        // Fallback fetch import if not available globally (older Node environments)
        const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
        
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
        if (!response.ok) {
            return { 
                statusCode: response.status, 
                headers, 
                body: JSON.stringify({ error: data.description || 'Telegram API error' }) 
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
