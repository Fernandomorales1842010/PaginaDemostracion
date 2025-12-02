import { updateCartCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // --- 1. ANIMACIÓN AL HACER SCROLL (INTERSECTION OBSERVER) ---
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Distancia desde abajo para activar

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Chequear al inicio por si ya están visibles

    // --- 2. HEADER CAMBIA AL BAJAR ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. TRANSICIÓN DE PÁGINA ---
    const transitionLinks = document.querySelectorAll('.js-transition-link');
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            const targetUrl = link.href;

            // Efecto de Zoom Out Blanco
            link.classList.add('card-exit-active');

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); // 0.6s coincide con la animación CSS
        });
    });

    // --- 4. MENÚ MÓVIL ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});