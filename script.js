/* -------------------------------------------------------------
 * GLASGOW DRIVE CONNECT - LEAD TRACKING & SCRIPT ENGINE
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle Handler
    initMobileMenu();

    // 2. Before & After Drag Slider
    initBeforeAfterSlider();

    // 3. Attach WhatsApp Click Tracking to All WhatsApp Links
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

/* WhatsApp Lead Tracking & Instant Notification Helper */
function notifyLead(leadData) {
    const payload = {
        client: 'Glasgow Drive Connect',
        event: 'PUPIL_WHATSAPP_LEAD',
        name: leadData.name || 'Website Visitor',
        phone: leadData.phone || 'N/A',
        service: leadData.service || 'Driving Lesson Enquiry',
        timestamp: new Date().toLocaleString()
    };

    // 1. Log to local Storage & Console
    const leads = JSON.parse(localStorage.getItem('gdc_leads') || '[]');
    leads.push(payload);
    localStorage.setItem('gdc_leads', JSON.stringify(leads));

    // 2. Background Beacon Notification (Sends instant alert to webhook/agency endpoint)
    if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('https://httpbin.org/post', blob);
    }
}

function initWhatsAppClickTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.addEventListener('click', () => {
            notifyLead({
                service: button.innerText.trim() || 'WhatsApp CTA Button Click'
            });
        });
    });
}

function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const scope = document.getElementById('custScope').value;

    notifyLead({
        name: name,
        phone: phone,
        service: scope
    });

    const message = `Hello Glasgow Drive Connect team,\nMy Name: ${name}\nPostcode / Contact: ${phone}\nLesson Needed: ${scope}\nI would like to get matched with an instructor in Glasgow!`;

    closeModal();
    window.open(`https://wa.me/447440679472?text=${encodeURIComponent(message)}`, '_blank');
}
