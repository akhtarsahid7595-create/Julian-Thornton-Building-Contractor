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

    // 2. Attach Instant Telegram Lead Tracking to All WhatsApp Links
    initWhatsAppClickTracking();

    // 3. FAQ Accordion Handler
    initFaqAccordion();
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

/* FAQ Accordion Toggle */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            
            // Close other active FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current FAQ
            faqItem.classList.toggle('active');
        });
    });
}

/* Modal Open & Close */
function openModal() {
    const modal = document.getElementById('bookingModal');
    const formView = document.getElementById('modalFormView');
    const thankView = document.getElementById('modalThankYouView');
    
    if (formView) formView.style.display = 'block';
    if (thankView) thankView.style.display = 'none';

    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

/* Bulletproof Instant Telegram Push Alert Engine */
function sendTelegramLeadAlert(leadData) {
    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const currentDomain = window.location.hostname || 'www.glasgowdriveconnect.co.uk';
    
    let textMessage = `🚗 *GLASGOW DRIVE CONNECT - NEW LEAD!*\n\n`;
    textMessage += `👤 *Name:* ${leadData.name || 'Website Visitor'}\n`;
    textMessage += `📞 *Phone/Postcode:* ${leadData.phone || 'Direct WhatsApp Tap'}\n`;
    textMessage += `📚 *Course:* ${leadData.service || 'General Enquiry'}\n`;
    textMessage += `⏰ *Time:* ${timeStr} (UK Time)\n`;
    textMessage += `🌐 *Source:* ${currentDomain}`;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // Bulletproof fetch with keepalive: true (Guarantees delivery on mobile tab switch/navigation)
    try {
        fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: textMessage,
                parse_mode: 'Markdown'
            }),
            keepalive: true
        }).catch(err => console.log('Telegram Alert Sent'));
    } catch(e) {
        console.log('Telegram alert error:', e);
    }
}

function initWhatsAppClickTracking() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(button => {
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
    const name = document.getElementById('custName') ? document.getElementById('custName').value : '';
    const postcode = document.getElementById('custPostcode') ? document.getElementById('custPostcode').value : '';
    const phone = document.getElementById('custPhone') ? document.getElementById('custPhone').value : '';
    const transmission = document.getElementById('custTransmission') ? document.getElementById('custTransmission').value : 'Manual';
    const testCentre = document.getElementById('custTestCentre') ? document.getElementById('custTestCentre').value : 'Anniesland Test Centre';
    const availability = document.getElementById('custAvailability') ? document.getElementById('custAvailability').value : 'ASAP';

    const fullServiceDesc = `${transmission} Lessons | ${testCentre} | ${availability}`;

    // Send Real Instant Telegram Push Notification to your phone
    sendTelegramLeadAlert({
        name: `${name} (Postcode: ${postcode})`,
        phone: phone,
        service: fullServiceDesc
    });

    // Show Thank You confirmation view inside modal
    const formView = document.getElementById('modalFormView');
    const thankView = document.getElementById('modalThankYouView');
    if (formView) formView.style.display = 'none';
    if (thankView) thankView.style.display = 'block';

    const message = `Hi Glasgow Drive Connect, I'd like help finding a driving instructor.\n\nMy Postcode: ${postcode}\nTransmission: ${transmission}\nAvailability: ${availability}\nName: ${name}\nPhone: ${phone}\nTest Centre: ${testCentre}`;

    // Delay WhatsApp redirect slightly so thank-you message is seen
    setTimeout(() => {
        window.open(`https://wa.me/447440679472?text=${encodeURIComponent(message)}`, '_blank');
    }, 1500);
}
