/* ========================================================
   MODERN MINIMALIST PORTFOLIO SCRIPT
   Interactive Filters, Direct Contact Form, Toast, & Ambient Canvas
   ======================================================== */

// Global Toast Notification Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/* ========================================================
   1. AMBIENT LIGHT PARTICLE CANVAS
   ======================================================== */
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.45;
            this.speedY = (Math.random() - 0.5) * 0.45;
            this.opacity = Math.random() * 0.12 + 0.04;
            // Clean slate blue & soft violet for subtle light theme texture
            this.color = Math.random() > 0.5 ? '37, 99, 235' : '124, 58, 237';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;

            // Gentle mouse avoidance
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = (1 - dist / 130) * 0.06;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    canvas.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resize();
    init();
    animate();
})();

/* ========================================================
   2. TYPEWRITER EFFECT
   ======================================================== */
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = [
        'AI & Machine Learning Developer',
        'Spatial 3D & Digital Twin Builder',
        'Open-Source Contributor (Rust & Python)',
        'Building Systems that Solve Real Problems'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (deleting) {
            el.textContent = current.substring(0, charIdx--);
            if (charIdx < 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 30);
        } else {
            el.textContent = current.substring(0, charIdx++);
            if (charIdx > current.length) {
                deleting = true;
                setTimeout(type, 2200);
                return;
            }
            setTimeout(type, 65);
        }
    }

    setTimeout(type, 800);
})();

/* ========================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ======================================================== */
(function () {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
})();

/* ========================================================
   4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
   ======================================================== */
(function () {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        // Compact navbar with blur on scroll
        navbar.classList.toggle('scrolled', window.scrollY > 30);

        // Active link tracking
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 130;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
})();

/* ========================================================
   5. MOBILE HAMBURGER MENU
   ======================================================== */
(function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
})();

/* ========================================================
   6. STAT COUNTER ANIMATION
   ======================================================== */
(function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target)) return;
                let count = 0;
                const duration = 1400;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    count += step;
                    if (count >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(count);
                    }
                }, 16);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
})();

/* ========================================================
   7. INTERACTIVE PROJECT FILTER TABS
   ======================================================== */
(function () {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Retrigger smooth reveal animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();

/* ========================================================
   8. 1-CLICK EMAIL COPY MODULE
   ======================================================== */
(function () {
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const displayEmail = document.getElementById('displayEmail');
    if (!btnCopyEmail || !displayEmail) return;

    btnCopyEmail.addEventListener('click', () => {
        const email = displayEmail.textContent.trim();
        navigator.clipboard.writeText(email).then(() => {
            btnCopyEmail.classList.add('copied');
            btnCopyEmail.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
            showToast('Email copied to clipboard: ' + email);

            setTimeout(() => {
                btnCopyEmail.classList.remove('copied');
                btnCopyEmail.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
            }, 2500);
        }).catch(() => {
            showToast('Email: ' + email);
        });
    });
})();

/* ========================================================
   9. INTERACTIVE DIRECT MESSAGE FORM & TOPIC SELECTORS
   ======================================================== */
(function () {
    const chips = document.querySelectorAll('.subject-chip');
    const subjectInput = document.getElementById('messageSubject');
    const form = document.getElementById('directContactForm');
    const feedback = document.getElementById('formFeedback');
    const btnCopyDraft = document.getElementById('btnCopyMessage');

    // Quick subject chip selection
    if (chips.length && subjectInput) {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                subjectInput.value = chip.getAttribute('data-subject');
            });
        });
    }

    // Helper to generate formatted message text
    function getMessageDraft() {
        const name = (document.getElementById('senderName')?.value || '').trim();
        const email = (document.getElementById('senderEmail')?.value || '').trim();
        const subject = (document.getElementById('messageSubject')?.value || '').trim();
        const body = (document.getElementById('messageBody')?.value || '').trim();

        const formatted = `Hi Sudarshan,\n\n${body}\n\nFrom: ${name} (${email})\nTopic: ${subject}`;
        return { name, email, subject, body, formatted };
    }

    // Copy draft button handler
    if (btnCopyDraft) {
        btnCopyDraft.addEventListener('click', () => {
            const draft = getMessageDraft();
            if (!draft.body) {
                showToast('Please type a message first!');
                return;
            }
            navigator.clipboard.writeText(draft.formatted).then(() => {
                btnCopyDraft.innerHTML = '<i class="fas fa-check"></i> Draft Copied!';
                showToast('Draft message copied to clipboard!');
                setTimeout(() => {
                    btnCopyDraft.innerHTML = '<i class="fas fa-clipboard"></i> Copy Draft';
                }, 2500);
            });
        });
    }

    // Direct Form Submission (Constructs pre-filled mailto & provides instant fallback)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const draft = getMessageDraft();

            if (!draft.name || !draft.email || !draft.body) {
                showToast('Please fill in all fields.');
                return;
            }

            const recipient = 'sudarshan.pai.y@gmail.com';
            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.formatted)}`;

            // Launch default mail client
            window.location.href = mailtoUrl;

            // Show friendly in-page feedback
            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.innerHTML = `
                    <strong><i class="fas fa-check-circle"></i> Opening your email application!</strong><br>
                    If your email client did not automatically launch, you can click <strong>Copy Draft</strong> above and send directly to <code>${recipient}</code>.
                `;
            }

            showToast('Draft message created!');
        });
    }
})();
