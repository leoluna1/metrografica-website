// MetroGráfica — comportamiento compartido por las 4 páginas del sitio.
// Lo específico de cada página (formularios, filtros, modal de fotos, etc.)
// vive en el <script> propio de cada .html.

(function () {
    // Smooth scroll para anclas internas
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.querySelectorAll('.dropdown > a').forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            if (toggle.getAttribute('href') === '#') {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                const wasOpen = dropdown.classList.contains('open');
                document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
                if (!wasOpen) dropdown.classList.add('open');
            }
        });
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        }
    });

    // Menú mobile
    function createMobileMenu() {
        const nav = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        if (!nav || !navLinks) return;

        let btn = document.querySelector('.mobile-menu-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.innerHTML = '☰';
            btn.className = 'mobile-menu-btn';
            btn.setAttribute('aria-label', 'Abrir menú');
            nav.appendChild(btn);

            btn.addEventListener('click', function () {
                const isOpen = navLinks.classList.toggle('open');
                btn.innerHTML = isOpen ? '✕' : '☰';
            });
        }
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
        window.open('https://wa.me/593995856385?text=' + encodeURIComponent(message), '_blank');
    };

    // Burbuja de bienvenida junto al botón flotante de WhatsApp
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        let dismissed = false;
        try { dismissed = localStorage.getItem('mg_whatsapp_bubble_dismissed') === '1'; } catch (e) {}

        if (!dismissed) {
            const bubble = document.createElement('a');
            bubble.className = 'whatsapp-bubble';
            bubble.href = whatsappFloat.href;
            bubble.target = '_blank';
            bubble.rel = 'noopener';
            bubble.innerHTML = 'Hola, bienvenido a MetroGráfica. ¿En qué podemos ayudarte?<button type="button" class="whatsapp-bubble-close" aria-label="Cerrar">×</button>';
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

    // Helper: confirmación no bloqueante (reemplaza alert())
    window.showToast = function (message, duration) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<svg class="icon toast-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p></p>';
        toast.querySelector('p').textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(function () { toast.classList.add('show'); });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 300);
        }, duration || 4000);
    };
})();
