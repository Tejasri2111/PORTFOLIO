// ===== THEME SWAPPER (LOCALSTORAGE PERSISTENCE) =====
const themeToggleBtn = document.getElementById('themeToggle');
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update toggle icon
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
};

// Initialize theme
if (themeToggleBtn) {
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== CANVAS PARTICLES BACKGROUND =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 60;
    const connectionDist = 125;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? 'rgba(138, 132, 255, 0.4)' : 'rgba(108, 99, 255, 0.25)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    };
    initParticles();

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw node lines
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const strokeColor = isDark ? 'rgba(138, 132, 255, 0.05)' : 'rgba(108, 99, 255, 0.05)';

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.8;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();
}

// ===== TYPING ANIMATION IN HERO =====
const typingTextElement = document.getElementById('typing-text');
if (typingTextElement) {
    const roles = ['Full Stack Developer', 'Blockchain & Web3 Explorer', 'Networking Enthusiast', '3rd Year CSE Student'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const erasingSpeed = 40;
    const pauseTime = 1800;

    const type = () => {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, pauseTime);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 300);
        } else {
            setTimeout(type, isDeleting ? erasingSpeed : typingSpeed);
        }
    };
    setTimeout(type, 500);
}

// ===== INTERACTIVE SKILLS FILTERING =====
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

if (filterButtons.length && skillCards.length) {
    // Hide all skill cards not matching the default active category ('frontend') on load
    const defaultCategory = 'frontend';
    skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === defaultCategory) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===== 3D CARD TILT EFFECT ON HOVER =====
const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length) {
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // mouse x relative inside card
            const y = e.clientY - rect.top;  // mouse y relative inside card

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const maxTilt = 8; // Maximum tilt rotation angles
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// ===== ANIMATED STATS COUNTER =====
const statNumbers = document.querySelectorAll('.stat-number');

const animateNumbers = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 1200;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);
            const current = Math.floor(eased * target);
            stat.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        requestAnimationFrame(updateCount);
    });
};

const heroStats = document.querySelector('.hero-stats');
if (heroStats && statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(heroStats);
}

// ===== CONTACT FORM WITH EMAILJS =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    // Initialize EmailJS - Replace with your Public Key
    emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all fields.';
            formStatus.className = 'form-status error';
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Send email via EmailJS
            await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'tejasri2111.m@gmail.com'
            });

            formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`;
            formStatus.className = 'form-status success';
            contactForm.reset();

            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        } catch (error) {
            console.error('Email send failed:', error);
            formStatus.textContent = 'Failed to send message. Please try again or email me directly.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}