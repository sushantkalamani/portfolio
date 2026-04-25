(function () {
    'use strict';

    // =========================================
    // PRELOADER
    // =========================================
    var loader = document.getElementById('loader');
    var loaderNumber = document.getElementById('loader-number');
    var loaderLine = loader.querySelector('.loader-line');
    var progress = { val: 0 };

    gsap.to(progress, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: function () {
            var v = Math.round(progress.val);
            loaderNumber.textContent = v;
            loaderLine.style.width = v + '%';
        },
        onComplete: function () {
            gsap.to(loader, {
                yPercent: -100,
                duration: 1,
                ease: 'power3.inOut',
                delay: 0.3,
                onComplete: function () {
                    loader.style.display = 'none';
                    startPageAnimations();
                }
            });
        }
    });

    // =========================================
    // SMOOTH SCROLL (LENIS)
    // =========================================
    var lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    // =========================================
    // CUSTOM CURSOR
    // =========================================
    var cursor = document.getElementById('cursor');
    var cursorDot = cursor.querySelector('.cursor-dot');
    var cursorCircle = cursor.querySelector('.cursor-circle');
    var mouseX = 0, mouseY = 0;
    var dotX = 0, dotY = 0;
    var circleX = 0, circleY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        circleX += (mouseX - circleX) * 0.08;
        circleY += (mouseY - circleY) * 0.08;

        cursorDot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px)';
        cursorCircle.style.transform = 'translate(' + circleX + 'px, ' + circleY + 'px)';
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Cursor hover states
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            var type = el.getAttribute('data-cursor');
            cursor.className = 'cursor is-' + type;
        });
        el.addEventListener('mouseleave', function () {
            cursor.className = 'cursor';
        });
    });

    // =========================================
    // NAVIGATION
    // =========================================
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('nav-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // =========================================
    // PAGE ANIMATIONS (after preloader)
    // =========================================
    function startPageAnimations() {
        // Show nav
        nav.classList.add('visible');

        // Hero animations
        var heroTl = gsap.timeline();
        heroTl
            .to('.hero-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to('.hero-title .line-inner', {
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.1
            }, '-=0.5')
            .to('.hero-tagline .reveal-text', {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.08
            }, '-=0.7')
            .to('.hero-scroll .reveal-text', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            .fromTo('.scroll-line', { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3');

        // Initialize scroll animations
        initScrollAnimations();
    }

    // =========================================
    // SCROLL-TRIGGERED ANIMATIONS
    // =========================================
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Marquee speed on scroll
        if (lenis) {
            var marquees = document.querySelectorAll('.marquee-inner');
            lenis.on('scroll', function (e) {
                var velocity = e.velocity;
                var skew = Math.min(Math.max(velocity * 0.4, -3), 3);
                marquees.forEach(function (m) {
                    m.style.transform = 'skewX(' + skew + 'deg)';
                });
            });
        }

        // Section labels
        document.querySelectorAll('.section-label').forEach(function (el) {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out'
            });
        });

        // About heading lines
        gsap.to('.about-heading .line-inner', {
            scrollTrigger: { trigger: '.about-heading', start: 'top 80%' },
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.08
        });

        // About description
        gsap.to('.about-description .reveal-text', {
            scrollTrigger: { trigger: '.about-description', start: 'top 85%' },
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12
        });

        // About image reveal
        var aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            var imgTl = gsap.timeline({
                scrollTrigger: { trigger: aboutImage, start: 'top 80%' }
            });
            imgTl
                .to(aboutImage, {
                    clipPath: 'inset(0% 0 0 0)',
                    duration: 1.2,
                    ease: 'power3.inOut'
                })
                .to(aboutImage.querySelector('img'), {
                    scale: 1,
                    duration: 1.4,
                    ease: 'power3.out'
                }, '-=0.8');
        }

        // About stats
        gsap.to('.stat-item', {
            scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
            opacity: 1, y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Experience lines
        document.querySelectorAll('.exp-line').forEach(function (line) {
            gsap.to(line, {
                scrollTrigger: { trigger: line, start: 'top 90%' },
                width: '100%',
                duration: 1,
                ease: 'power2.inOut'
            });
        });

        // Experience reveal texts
        document.querySelectorAll('.exp-item .reveal-text').forEach(function (el) {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out'
            });
        });

        // Project lines
        document.querySelectorAll('.project-line').forEach(function (line) {
            gsap.to(line, {
                scrollTrigger: { trigger: line, start: 'top 92%' },
                width: '100%',
                duration: 0.8,
                ease: 'power2.inOut'
            });
        });

        // Project rows
        document.querySelectorAll('.project-row-inner').forEach(function (row) {
            gsap.from(row, {
                scrollTrigger: { trigger: row, start: 'top 88%' },
                opacity: 0, y: 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Contact heading
        gsap.to('.contact-heading .line-inner', {
            scrollTrigger: { trigger: '.contact-heading', start: 'top 80%' },
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.1
        });

        // Contact sub + CTA
        gsap.to('.contact-sub', {
            scrollTrigger: { trigger: '.contact-sub', start: 'top 88%' },
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.magnetic-btn', {
            scrollTrigger: { trigger: '.magnetic-btn', start: 'top 90%' },
            opacity: 0, y: 24,
            duration: 0.7,
            ease: 'power3.out'
        });

        gsap.from('.social-link', {
            scrollTrigger: { trigger: '.contact-socials', start: 'top 90%' },
            opacity: 0, y: 16,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }

    // =========================================
    // MAGNETIC BUTTON
    // =========================================
    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', function () {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });

})();
