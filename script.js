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
})();
