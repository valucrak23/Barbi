// Configuración
const waNumber = '5491133942309'; // Reemplazar por número real

// Variables globales
let isNavOpen = false;
let sliderIndex = 0;
let sliderTimer = null;
let experiences = [];

// Elementos del DOM
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('primary-nav');

// Debug: verificar que los elementos existan
console.log('navToggle:', navToggle);
console.log('siteNav:', siteNav);
const slider = document.getElementById('slider');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const experiencesContainer = document.getElementById('experiencesContainer');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDuration = document.getElementById('modalDuration');
const modalActivities = document.getElementById('modalActivities');
const modalExtra = document.getElementById('modalExtra');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalReserveBtn = document.getElementById('modalReserveBtn');
const reserveForm = document.getElementById('reserveForm');
const heroReserveBtn = document.getElementById('heroReserveBtn');
const videoReserveBtn = document.getElementById('videoReserveBtn');
const contactoSection = document.getElementById('contacto');
const opinionesSection = document.getElementById('opiniones');
const writeOpinionBtn = document.getElementById('writeOpinionBtn');

// Funciones de navegación
function toggleNav() {
    console.log('toggleNav called, isNavOpen:', isNavOpen);
    isNavOpen = !isNavOpen;
    console.log('After toggle, isNavOpen:', isNavOpen);
    siteNav.classList.toggle('open', isNavOpen);
    navToggle.setAttribute('aria-expanded', isNavOpen.toString());
    console.log('siteNav classes:', siteNav.className);
    
    // Agregar clase para animación del botón
    if (isNavOpen) {
        navToggle.classList.add('active');
    } else {
        navToggle.classList.remove('active');
    }
}

function closeNav() {
    isNavOpen = false;
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
}

// Funciones del slider
function next() {
    sliderIndex = (sliderIndex + 1) % 3;
    updateSlider();
}

function prev() {
    sliderIndex = sliderIndex === 0 ? 2 : sliderIndex - 1;
    updateSlider();
}

function updateSlider() {
    const slides = document.querySelector('.slides');
    slides.style.transform = `translateX(-${sliderIndex * 100}%)`;
}

// Función para generar enlaces de WhatsApp
function waLink(payload = {}) {
    const base = `https://wa.me/${waNumber}`;
    let text = 'Hola! Quiero reservar con Princess Club.';
    
    if (payload.type === 'pkg') {
        const name = payload.name || '';
        const price = payload.price ? `€${payload.price}` : '';
        const duration = payload.duration ? `${payload.duration} min` : '';
        const extra = payload.extra ? ` — ${payload.extra}` : '';
        text = `Hola! Quiero reservar el ${name} (${duration}) ${extra}. Precio publicado ${price}.`;
    } else if (payload.type === 'video') {
        const price = payload.price ? `€${payload.price}` : '';
        text = `Hola! Quiero encargar un Video Felicitacion. Precio publicado ${price}.`;
    }
    
    return `${base}?text=${encodeURIComponent(text)}`;
}

// Cargar experiencias desde JSON
async function loadExperiences() {
    try {
        const response = await fetch('./experiences.json');
        const data = await response.json();
        experiences = data;
        renderExperiences();
    } catch (error) {
        console.error('Error cargando experiencias:', error);
    }
}

// Renderizar experiencias
function renderExperiences() {
    experiencesContainer.innerHTML = '';
    
    experiences.forEach(exp => {
        const article = document.createElement('article');
        article.className = 'pkg';
        
        article.innerHTML = `
            <h3>${exp.title}</h3>
            ${exp.duration ? `<p class="pkg-meta">Duracion: ${exp.duration}</p>` : ''}
            <p class="pkg-tagline">${exp.tagline}</p>
            <div class="hero-cta" style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                <a class="btn" href="${waLink({ type: 'pkg', name: exp.title, duration: exp.duration, extra: exp.extra })}" target="_blank" rel="noopener">Reservar</a>
                <a class="btn btn-secondary" href="#" data-exp-id="${exp.id}">Ver detalles</a>
            </div>
        `;
        
        experiencesContainer.appendChild(article);
    });
    
    // Agregar event listeners para los botones de detalles
    const detailBtns = document.querySelectorAll('[data-exp-id]');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const expId = btn.getAttribute('data-exp-id');
            const exp = experiences.find(e => e.id === expId);
            if (exp) openModal(exp);
        });
    });
}

// Funciones del modal
function openModal(exp) {
    selectedExp = exp;
    modalTitle.textContent = exp.title;
    modalDuration.textContent = exp.duration ? `Duracion: ${exp.duration}` : '';
    
    modalActivities.innerHTML = '';
    if (exp.activities) {
        exp.activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            modalActivities.appendChild(li);
        });
    }
    
    modalExtra.textContent = exp.extra || '';
    modalReserveBtn.href = waLink({ type: 'pkg', name: exp.title, duration: exp.duration, extra: exp.extra });
    modal.style.display = 'grid';
}

function closeModal() {
    modal.style.display = 'none';
    selectedExp = null;
}

// Función para enviar reserva
function submitReserve(e) {
    e.preventDefault();
    const name = document.getElementById('reserveName').value;
    const email = document.getElementById('reserveEmail').value;
    const message = document.getElementById('reserveMessage').value;
    
    const base = `https://wa.me/${waNumber}`;
    const text = `Hola! Soy ${name}. Mi email es ${email}. ${message}`;
    window.open(`${base}?text=${encodeURIComponent(text)}`, '_blank');
}

// Función para configurar enlaces de WhatsApp
function setupWhatsAppLinks() {
    heroReserveBtn.href = waLink({ type: 'general' });
    videoReserveBtn.href = waLink({ type: 'video' });
}

// Funciones para mostrar/ocultar secciones
function showContacto() {
    // Ocultar otras secciones
    opinionesSection.style.display = 'none';
    
    // Mostrar sección de contacto
    contactoSection.style.display = 'block';
    
    // Scroll suave hacia la sección
    contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Cerrar menú móvil si está abierto
    closeNav();
}

function showOpiniones() {
    // Ocultar otras secciones
    contactoSection.style.display = 'none';
    
    // Mostrar sección de opiniones
    opinionesSection.style.display = 'block';
    
    // Scroll suave hacia la sección
    opinionesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Cerrar menú móvil si está abierto
    closeNav();
}

function hideSections() {
    contactoSection.style.display = 'none';
    opinionesSection.style.display = 'none';
}

// Función para scroll suave y navegación activa
function setupSmoothScroll() {
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    const sections = links
        .map(a => a.getAttribute('href'))
        .filter(id => id && id.startsWith('#') && id.length > 1)
        .map(id => document.getElementById(id.slice(1)))
        .filter(Boolean);
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#' || id.length < 2) return;
            const target = document.getElementById(id.slice(1));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', id);
            closeNav(); // Cerrar navegación móvil después del click
        });
    });
    
    // Observer para navegación activa
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = '#' + entry.target.id;
            const link = document.querySelector(`a[href='${id}']`);
            if (!link) return;
            link.classList.toggle('active', entry.isIntersecting);
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    
    sections.forEach(sec => observer.observe(sec));
}

// Función para detectar texto del sistema agrandado
function checkLargeText() {
    const LARGE_TEXT_THRESHOLD_PX = 20;
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.fontSize = '1rem';
    probe.textContent = 'M';
    document.body.appendChild(probe);
    const px = probe.getBoundingClientRect().height;
    probe.remove();
    document.body.classList.toggle('a11y-large-text', px >= LARGE_TEXT_THRESHOLD_PX);
}

// Función para swipe táctil del carrusel
function setupTouchSlider() {
    const sliderEl = document.querySelector('.slider');
    if (!sliderEl) return;
    
    let startX = 0;
    let currentX = 0;
    let tracking = false;
    
    const onStart = (e) => {
        tracking = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
    };
    
    const onMove = (e) => {
        if (!tracking) return;
        currentX = (e.touches ? e.touches[0].clientX : e.clientX);
    };
    
    const onEnd = () => {
        if (!tracking) return;
        const delta = currentX - startX;
        tracking = false;
        if (Math.abs(delta) > 40) {
            delta < 0 ? next() : prev();
        }
    };
    
    sliderEl.addEventListener('touchstart', onStart, { passive: true });
    sliderEl.addEventListener('touchmove', onMove, { passive: true });
    sliderEl.addEventListener('touchend', onEnd);
    sliderEl.addEventListener('mousedown', onStart);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('mousemove', onMove);
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar experiencias
    await loadExperiences();
    
    // Configurar año en el footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Configurar slider automático
    sliderTimer = setInterval(() => next(), 4500);
    
    // Configurar navegación
    navToggle.addEventListener('click', toggleNav);
    
    // Configurar slider
    sliderPrev.addEventListener('click', prev);
    sliderNext.addEventListener('click', next);
    
    // Configurar modal
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Configurar formulario de reserva
    reserveForm.addEventListener('submit', submitReserve);
    
    // Configurar enlaces de WhatsApp
    setupWhatsAppLinks();
    
    // Configurar enlaces del footer
    const contactoLink = document.querySelector('.social-link[aria-label="Contacto"]');
    const opinionesLink = document.querySelector('.social-link[aria-label="Opiniones"]');
    
    if (contactoLink) {
        contactoLink.addEventListener('click', (e) => {
            e.preventDefault();
            showContacto();
        });
    }
    
    if (opinionesLink) {
        opinionesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showOpiniones();
        });
    }
    
    // Configurar botón de opinión
    if (writeOpinionBtn) {
        writeOpinionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = 'Hola! Quiero dejar mi opinión sobre Princess Club.';
            window.open(`${waLink({ type: 'general' })}&text=${encodeURIComponent(text)}`, '_blank');
        });
    }
    
    // Ocultar secciones cuando se hace click en enlaces de navegación
    const navLinks = document.querySelectorAll('.site-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hideSections();
        });
    });
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Detectar texto agrandado
    checkLargeText();
    let a11yTimer = null;
    const onViewportChange = () => {
        if (a11yTimer) clearTimeout(a11yTimer);
        a11yTimer = setTimeout(checkLargeText, 150);
    };
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
    
    // Configurar swipe táctil
    setupTouchSlider();
});

// Cleanup al descargar la página
window.addEventListener('beforeunload', () => {
    if (sliderTimer) clearInterval(sliderTimer);
});
