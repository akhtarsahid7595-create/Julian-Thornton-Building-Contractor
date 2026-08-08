/* -------------------------------------------------------------
 * SOUTH SCAPED - BIRCH LANDSCAPES MOBILE OPTIMIZED SCRIPT
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle Handler
    initMobileMenu();

    // 2. Before & After Drag Slider
    initBeforeAfterSlider();
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

function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const scope = document.getElementById('custScope').value;

    const message = `Hello Julian Thornton Building Contractor team,\nMy Name: ${name}\nPhone: ${phone}\nService Required: ${scope}\nLocation: South Lakes / North Yorkshire & Surrounding Areas\nI would like to request a project consultation.`;

    closeModal();
    alert(`Thank you ${name}! Your consultation request for ${scope} has been logged.`);
}
