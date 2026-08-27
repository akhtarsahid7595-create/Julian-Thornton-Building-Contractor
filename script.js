/* -------------------------------------------------------------
 * GLASGOW DRIVE CONNECT - LEAD ENGINE & ANALYTICS TRACKING
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ensure modal is injected if not already present in the HTML page
    injectBookingModalIfNeeded();

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Mobile Menu Toggle Handler
    initMobileMenu();

    // 3. Attach Anti-Fraud Lead Form Trigger to All WhatsApp Links
    initWhatsAppClickTracking();

    // 4. FAQ Accordion Handler
    initFaqAccordion();

    // 5. Track Form Interactions (GA4 form_start)
    initFormStartTracking();

    // 6. Track secondary CTAs and postcode checks
    initSecondaryCtaTracking();
});

/* Dynamic Booking Modal Injector (for service pages / landing pages) */
function injectBookingModalIfNeeded() {
    if (document.getElementById('bookingModal')) {
        return; // Already present in index.html
    }

    const modalHTML = `
    <div class="birch-modal-overlay" id="bookingModal">
        <div class="birch-modal-box">
            <button class="birch-modal-close" id="closeModalBtn">&times;</button>
            
            <div id="modalFormView">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <span class="usp-badge" style="font-size:0.75rem;"><i data-lucide="shield-check"></i> Free Instructor Match Request</span>
                </div>
                <h3 style="color:var(--hp-ink); margin-bottom:4px; font-size:1.25rem;">Find Your Driving Instructor</h3>
                <p style="color:var(--hp-graphite); font-size:0.85rem; margin-bottom:16px;">Quickly enter your details to check instructor availability and connect on WhatsApp.</p>

                <form id="leadForm">
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Full Name *</label>
                        <input type="text" id="custName" required placeholder="e.g. John Smith" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Glasgow Postcode *</label>
                        <input type="text" id="custPostcode" required placeholder="e.g. G12 8QQ" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Phone / WhatsApp Number *</label>
                        <input type="tel" id="custPhone" required placeholder="e.g. 07700 900123" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Lesson Preference *</label>
                        <select id="custTransmission" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                            <option value="Manual">Manual Driving Lessons</option>
                            <option value="Automatic">Automatic Driving Lessons</option>
                            <option value="Female Instructor Request">Female Instructor Request</option>
                            <option value="Intensive Course">Intensive Driving Course</option>
                        </select>
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Lesson Availability *</label>
                        <select id="custAvailability" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                            <option value="Flexible / ASAP">Flexible / ASAP</option>
                            <option value="Weekdays (Mornings)">Weekdays (Mornings)</option>
                            <option value="Weekdays (Evenings)">Weekdays (Evenings)</option>
                            <option value="Weekends">Weekends</option>
                        </select>
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-weight:700; font-size:0.8rem; margin-bottom:4px; color:var(--hp-ink);">Preferred Test Centre (If known)</label>
                        <select id="custTestCentre" style="width:100%; padding:10px 12px; border:1px solid var(--hp-fog); border-radius:6px; font-size:16px;">
                            <option value="No Preference">No Preference / Not Sure</option>
                            <option value="Anniesland">Anniesland Test Centre</option>
                            <option value="Baillieston">Baillieston Test Centre</option>
                            <option value="Shieldhall">Shieldhall Test Centre</option>
                            <option value="Paisley">Paisley Test Centre</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-whatsapp allow-direct-wa" style="width:100%; font-size:14px; padding:14px 20px;">
                        <i data-lucide="message-circle"></i> GET MATCHED FREE ➔
                    </button>
                    <p style="text-align:center; font-size:0.75rem; color:var(--hp-steel); margin-top:8px; margin-bottom:0;">🔒 100% Free Matching. No obligation.</p>
                </form>
            </div>

            <div id="modalThankYouView" style="display:none; text-align:center; padding:24px 12px;">
                <i data-lucide="check-circle" style="width:52px; height:52px; color:var(--whatsapp-green); margin-bottom:12px;"></i>
                <h3 style="margin-bottom:6px;">Lead Verified!</h3>
                <p style="color:var(--hp-graphite); font-size:0.95rem; margin-bottom:20px;">Redirecting you to WhatsApp to connect with available local instructors...</p>
                <a id="modalDirectWaBtn" href="#" target="_blank" class="btn-whatsapp allow-direct-wa" style="width:100%;">
                    <i data-lucide="message-circle"></i> OPEN WHATSAPP NOW
                </a>
            </div>
        </div>
    </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    // Attach form listener and close listener to injected elements
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', submitForm);
    }
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* GA4 Custom Event Dispatcher with console logging simulation */
function trackGAEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
        console.log(`GA4 Tracked Event: "${eventName}"`, eventParams);
    } else {
        console.log(`GA4 Simulated Event: "${eventName}"`, eventParams);
    }
}

/* Secure Telegram Notification Push using Serverless Handlers */
async function sendTelegramAlert(textMessage) {
    // Attempt Vercel Function first
    const endpoints = [
        '/api/telegram',
        '/.netlify/functions/telegram'
    ];

    let success = false;
    for (const url of endpoints) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textMessage }),
                keepalive: true
            });
            if (res.ok) {
                console.log(`Telegram alert successfully sent via endpoint: ${url}`);
                success = true;
                break;
            }
        } catch (e) {
            console.log(`Endpoint ${url} failed to send Telegram alert:`, e);
        }
    }

    if (!success) {
        console.log("Telegram Alert (Simulated / Local Fallback):\n", textMessage);
    }
}

/* Mobile Menu Toggle */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.getElementById('navMenuList');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

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
            
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

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

/* Form start tracking (GA4 form_start) */
function initFormStartTracking() {
    let formStarted = false;
    const inputs = document.querySelectorAll('#bookingModal input, #bookingModal select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (!formStarted) {
                formStarted = true;
                trackGAEvent('form_start', {
                    page_path: window.location.pathname
                });
            }
        });
    });
}

/* Track secondary CTAs and postcode checks */
function initSecondaryCtaTracking() {
    document.querySelectorAll('.btn-hp-outline, .btn-hp-black').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.innerText || btn.textContent;
            trackGAEvent('cta_click', {
                cta_name: text.trim(),
                page_path: window.location.pathname
            });

            if (text.toLowerCase().includes('postcode')) {
                trackGAEvent('postcode_check', {
                    page_path: window.location.pathname
                });
            }
        });
    });
}

/* Intercept WhatsApp CTA Clicks to trigger Lead Form */
function initWhatsAppClickTracking() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(button => {
        button.addEventListener('click', (e) => {
            // Check if is inside modal or is the direct opening redirect button
            if (button.closest('#bookingModal') || button.classList.contains('allow-direct-wa')) {
                // If it is the final redirect button in the thank-you screen
                if (button.id === 'modalDirectWaBtn') {
                    trackGAEvent('lead_generated', {
                        page_path: window.location.pathname
                    });
                    
                    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
                    sendTelegramAlert(`🔗 *WHATSAPP REDIRECT CLICKED!*\nUser clicked 'OPEN WHATSAPP NOW' and is proceeding to open the chat.\n⏰ *Time:* ${timeStr}`);
                }
                return;
            }

            e.preventDefault();

            const text = (button.innerText || button.textContent || '').toLowerCase();
            const transSelect = document.getElementById('custTransmission');
            
            // Track the initial click event
            const isMobile = window.innerWidth <= 768;
            const eventName = isMobile ? 'mobile_whatsapp_click' : 'whatsapp_click';
            
            trackGAEvent(eventName, {
                button_text: button.innerText.trim(),
                page_path: window.location.pathname
            });

            // Set default selections based on clicked button context
            if (transSelect) {
                if (text.includes('automatic')) {
                    transSelect.value = 'Automatic';
                    trackGAEvent('automatic_inquiry', { page_path: window.location.pathname });
                } else if (text.includes('female')) {
                    transSelect.value = 'Female Instructor Request';
                    trackGAEvent('female_instructor_inquiry', { page_path: window.location.pathname });
                } else if (text.includes('intensive')) {
                    transSelect.value = 'Intensive Course';
                    trackGAEvent('intensive_course_inquiry', { page_path: window.location.pathname });
                } else if (text.includes('manual')) {
                    transSelect.value = 'Manual';
                }
            }

            // Send Telegram notification for initial WhatsApp click (User showing interest)
            const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
            sendTelegramAlert(`📱 *WHATSAPP CTA TAP ALERT!*\nVisitor clicked WhatsApp button: "${button.innerText.trim()}"\nPage: ${window.location.pathname}\n⏰ *Time:* ${timeStr}\nStatus: Opening Lead Verification Form.`);

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
    const testCentre = document.getElementById('custTestCentre') ? document.getElementById('custTestCentre').value : 'No Preference';

    // Track Form Submit in Google Analytics
    trackGAEvent('form_submit', {
        page_path: window.location.pathname,
        transmission_preference: transmission,
        availability_preference: availability,
        test_centre_preference: testCentre
    });

    const fullServiceDesc = `${transmission} Lessons | Availability: ${availability} | Test Centre: ${testCentre}`;

    // Format secure Telegram message for instant alerting
    const timeStr = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const currentDomain = window.location.hostname || 'www.glasgowdriveconnect.co.uk';
    
    let textMessage = `🚨 *GLASGOW DRIVE CONNECT - NEW VERIFIED LEAD!*\n\n`;
    textMessage += `👤 *Name:* ${name || 'Not Provided'}\n`;
    textMessage += `📍 *Postcode:* ${postcode || 'Not Provided'}\n`;
    textMessage += `📞 *Phone/WhatsApp:* ${phone || 'Not Provided'}\n`;
    textMessage += `⚙️ *Preference:* ${transmission}\n`;
    textMessage += `⏰ *Availability:* ${availability}\n`;
    textMessage += `🏫 *Test Centre:* ${testCentre}\n`;
    textMessage += `🕒 *Timestamp:* ${timeStr} (UK Time)\n`;
    textMessage += `🌐 *Source Domain:* ${currentDomain}`;

    // Send Alert to Telegram via Serverless function
    sendTelegramAlert(textMessage);

    // Build URL encoded message for WhatsApp redirection
    const message = `Hi Glasgow Drive Connect, I'd like help finding a driving instructor.\n\nName: ${name}\nPostcode: ${postcode}\nPhone: ${phone}\nTransmission: ${transmission}\nAvailability: ${availability}\nTest Centre: ${testCentre}`;
    const waUrl = `https://wa.me/447440679472?text=${encodeURIComponent(message)}`;

    // Set link inside direct button
    const directBtn = document.getElementById('modalDirectWaBtn');
    if (directBtn) {
        directBtn.href = waUrl;
    }

    // Switch view to Thank You confirmation screen
    const formView = document.getElementById('modalFormView');
    const thankView = document.getElementById('modalThankYouView');
    if (formView) formView.style.display = 'none';
    if (thankView) thankView.style.display = 'block';

    // Automatically trigger redirect after 800ms
    setTimeout(() => {
        window.open(waUrl, '_blank');
    }, 800);
}
