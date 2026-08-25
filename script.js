/* -------------------------------------------------------------
 * GLASGOW DRIVE CONNECT - REAL TELEGRAM LEAD NOTIFICATION ENGINE
 * ------------------------------------------------------------- */

const TELEGRAM_BOT_TOKEN = '8859361744:AAFApSnYCI1ltxeS5fUzCaKFfaoBC2Ps8AI';
const TELEGRAM_CHAT_ID = '5235553652';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle Handler
    initMobileMenu();

    // 2. Before & After Drag Slider
    initBeforeAfterSlider();

    // 3. Attach Instant Telegram Lead Tracking to All WhatsApp Links
    initWhatsAppClickTracking();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenuList');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

/* Before & After Comparison Slider */
function initBeforeAfterSlider() {
    const slider = document.getElementById('baSlider');
    const afterImg = document.getElementById('afterImage');
    const handle = document.getElementById('baHandle');

    if (!slider || !afterImg || !handle) return;

    let isDragging = false;

    function updateSlider(xPos) {
        const rect = slider.getBoundingClientRect();
        let offsetX = xPos - rect.left;

        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        const percent = (offsetX / rect.width) * 100;
        afterImg.style.width = `${percent}%`;
        handle.style.left = `${percent}%`;
    }

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* Modal Open & Close */
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

/* Instant Telegram Push Alert Engine */
function sendTelegramLeadAlert(leadData) {
    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    
    let textMessage = `🚗 *GLASGOW DRIVE CONNECT - NEW LEAD!*\n\n`;
    textMessage += `👤 *Name:* ${leadData.name || 'Website Visitor'}\n`;
    textMessage += `📞 *Phone/Postcode:* ${leadData.phone || 'Direct WhatsApp Tap'}\n`;
    textMessage += `📚 *Course:* ${leadData.service || 'General Enquiry'}\n`;
    textMessage += `⏰ *Time:* ${timeStr} (UK Time)\n`;
    textMessage += `🌐 *Source:* glasgowdriveconnect.vercel.app`;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // Send instant background POST request
    fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: textMessage,
            parse_mode: 'Markdown'
        })
    }).catch(err => console.log('Telegram Alert Sent'));
}

function initWhatsAppClickTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.innerText.replace(/[\n\r]+/g, ' ').trim();
            sendTelegramLeadAlert({
                name: 'Direct WhatsApp Visitor',
                phone: 'Clicked WhatsApp Button',
                service: buttonText || 'WhatsApp CTA Click'
            });
        });
    });
}

function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const scope = document.getElementById('custScope').value;

    // Send Real Instant Telegram Push Notification to your phone
    sendTelegramLeadAlert({
        name: name,
        phone: phone,
        service: scope
    });

    const message = `Hello Glasgow Drive Connect team,\nMy Name: ${name}\nPostcode / Contact: ${phone}\nLesson Needed: ${scope}\nI would like to get matched with an instructor in Glasgow!`;

    closeModal();
    window.open(`https://wa.me/447440679472?text=${encodeURIComponent(message)}`, '_blank');
}
