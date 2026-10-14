// MetroGráfica — comportamiento compartido por las 4 páginas del sitio.
// Lo específico de cada página (filtros, visor de fotos y otros detalles)
// vive en el <script> propio de cada .html.

(function () {
    // Enlace para saltar la navegación con teclado.
    const firstSection = document.querySelector('.hero, main, .main-container');
    if (firstSection) {
        firstSection.id = firstSection.id || 'contenido';
        firstSection.tabIndex = -1;
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#' + firstSection.id;
        skipLink.textContent = 'Saltar al contenido';
        document.body.prepend(skipLink);
    }

    // Smooth scroll para anclas internas
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });

    // Header: sombra al hacer scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // Dropdown del nav: clic/tap para abrir (además del hover en desktop)
    function closeDropdowns(except) {
        document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
            if (dropdown !== except) {
                dropdown.classList.remove('open');
                const button = dropdown.querySelector(':scope > a');
                if (button) button.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('.dropdown > a').forEach(function (toggle) {
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function (e) {
            if (toggle.getAttribute('href') === '#') {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                const wasOpen = dropdown.classList.contains('open');
                closeDropdowns(dropdown);
                dropdown.classList.toggle('open', !wasOpen);
                toggle.setAttribute('aria-expanded', String(!wasOpen));
            }
        });
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) closeDropdowns();
    });

    // Menú mobile
    function createMobileMenu() {
        const nav = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        if (!nav || !navLinks) return;

        let btn = document.querySelector('.mobile-menu-btn');
        nav.setAttribute('aria-label', 'Navegación principal');
        navLinks.id = navLinks.id || 'menu-principal';
        if (!btn) {
            btn = document.createElement('button');
            btn.textContent = 'Menú';
            btn.className = 'mobile-menu-btn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Abrir menú de navegación');
            btn.setAttribute('aria-controls', navLinks.id);
            btn.setAttribute('aria-expanded', 'false');
            nav.appendChild(btn);

            btn.addEventListener('click', function () {
                const isOpen = navLinks.classList.toggle('open');
                btn.textContent = isOpen ? 'Cerrar' : 'Menú';
                btn.setAttribute('aria-expanded', String(isOpen));
                btn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
            });
        }

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                btn.textContent = 'Menú';
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-label', 'Abrir menú de navegación');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navLinks.classList.remove('open');
                btn.textContent = 'Menú';
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-label', 'Abrir menú de navegación');
                closeDropdowns();
                if (document.activeElement.closest('.dropdown')) {
                    document.querySelector('.dropdown > a').focus();
                }
            }
        });
    }
    window.addEventListener('resize', createMobileMenu);
    createMobileMenu();

    // Reveal-on-scroll para elementos .fade-in
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = (index * 0.05) + 's';
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.fade-in, [data-reveal]').forEach(function (el) {
        observer.observe(el);
    });

    // Helper: abrir WhatsApp con un mensaje (número real de MetroGráfica)
    window.openWhatsApp = function (message) {
        return window.open('https://wa.me/593995856385?text=' + encodeURIComponent(message), '_blank', 'noopener');
    };

    // Burbuja de bienvenida junto al botón flotante de WhatsApp
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        let dismissed = false;
        try { dismissed = localStorage.getItem('mg_whatsapp_bubble_dismissed') === '1'; } catch (e) {}

        if (!dismissed) {
            const bubble = document.createElement('div');
            bubble.className = 'whatsapp-bubble';
            bubble.innerHTML = '<a class="whatsapp-bubble-link" href="' + whatsappFloat.href + '" target="_blank" rel="noopener">Hola, bienvenido a MetroGráfica. ¿En qué podemos ayudarte?</a><button type="button" class="whatsapp-bubble-close" aria-label="Cerrar mensaje">×</button>';
            document.body.appendChild(bubble);

            setTimeout(function () { bubble.classList.add('show'); }, 1800);

            bubble.querySelector('.whatsapp-bubble-close').addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                bubble.classList.remove('show');
                try { localStorage.setItem('mg_whatsapp_bubble_dismissed', '1'); } catch (err) {}
                setTimeout(function () { bubble.remove(); }, 300);
            });
        }
    }

})();
