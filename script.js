/* -------------------------------------------------------------
 * GLASGOW DRIVE CONNECT - ANTI-FRAUD LEAD TRACKING ENGINE
 * ------------------------------------------------------------- */

const TELEGRAM_BOT_TOKEN = '8859361744:AAFApSnYCI1ltxeS5fUzCaKFfaoBC2Ps8AI';
const TELEGRAM_CHAT_ID = '5235553652';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle Handler
    initMobileMenu();

    // 2. Attach Anti-Fraud Lead Form Trigger to All WhatsApp Links
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

/* Bulletproof Instant Telegram Anti-Fraud Push Alert Engine */
function sendTelegramLeadAlert(leadData) {
    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const currentDomain = window.location.hostname || 'www.glasgowdriveconnect.co.uk';
    
    let textMessage = `🚨 *GLASGOW DRIVE CONNECT - VERIFIED LEAD LOG!*\n\n`;
    textMessage += `👤 *Name:* ${leadData.name || 'Website Visitor'}\n`;
    textMessage += `📍 *Postcode:* ${leadData.postcode || 'Not Provided'}\n`;
    textMessage += `📞 *Phone/WhatsApp:* ${leadData.phone || 'Direct Tap'}\n`;
    textMessage += `⚙️ *Preference:* ${leadData.service || 'General Matching'}\n`;
    textMessage += `⏰ *Timestamp:* ${timeStr} (UK Time)\n`;
    textMessage += `🌐 *Source Domain:* ${currentDomain}`;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
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

/* Intercept WhatsApp CTA Clicks to trigger Lead Form */
function initWhatsAppClickTracking() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(button => {
        button.addEventListener('click', (e) => {
            // If button is inside modal or is the direct opening button, allow direct navigation
            if (button.closest('#bookingModal') || button.classList.contains('allow-direct-wa')) {
                return;
            }

            e.preventDefault();

            // Auto-select transmission in form based on button text/context
            const text = button.innerText.toLowerCase();
            const transSelect = document.getElementById('custTransmission');
            if (transSelect) {
                if (text.includes('automatic')) transSelect.value = 'Automatic';
                else if (text.includes('female')) transSelect.value = 'Female Instructor Preference';
                else if (text.includes('intensive')) transSelect.value = 'Intensive Course';
                else if (text.includes('manual')) transSelect.value = 'Manual';
            }

            openModal();
        });
    });
}

/* Lead Form Submission Handler */
function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('custName') ? document.getElementById('custName').value.trim() : '';
    const postcode = document.getElementById('custPostcode') ? document.getElementById('custPostcode').value.trim() : '';
    const phone = document.getElementById('custPhone') ? document.getElementById('custPhone').value.trim() : '';
    const transmission = document.getElementById('custTransmission') ? document.getElementById('custTransmission').value : 'Manual';
    const availability = document.getElementById('custAvailability') ? document.getElementById('custAvailability').value : 'ASAP';

    const fullServiceDesc = `${transmission} Lessons | Availability: ${availability}`;

    // Send High-Priority Anti-Fraud Lead Proof to Telegram
    sendTelegramLeadAlert({
        name: name,
        postcode: postcode,
        phone: phone,
        service: fullServiceDesc
    });

    const message = `Hi Glasgow Drive Connect, I'd like help finding a driving instructor.\n\nName: ${name}\nPostcode: ${postcode}\nPhone: ${phone}\nTransmission: ${transmission}\nAvailability: ${availability}`;
    const waUrl = `https://wa.me/447440679472?text=${encodeURIComponent(message)}`;

    // Set modal direct link
    const directBtn = document.getElementById('modalDirectWaBtn');
    if (directBtn) {
        directBtn.href = waUrl;
    }

    // Switch view to Thank You confirmation
    const formView = document.getElementById('modalFormView');
    const thankView = document.getElementById('modalThankYouView');
    if (formView) formView.style.display = 'none';
    if (thankView) thankView.style.display = 'block';

    // Redirect to WhatsApp after 800ms
    setTimeout(() => {
        window.open(waUrl, '_blank');
    }, 800);
}
