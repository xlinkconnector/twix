// ============================================
// TWIX Chain Landing Page - Main JavaScript
// Interactive functionality and user experience
// ============================================

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Navigation
// ============================================

class Navigation {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.init();
    }
    
    init() {
        // Scroll behavior
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 100));
        
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Smooth scroll for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScroll(href);
                    this.closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileToggle.setAttribute(
            'aria-expanded',
            this.navMenu.classList.contains('active')
        );
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ============================================
// Particle Background
// ============================================

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', debounce(() => {
            this.resize();
        }, 250));
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x -= dx * force * 0.01;
                    particle.y -= dy * force * 0.01;
                }
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Tabs Component
// ============================================

class Tabs {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.buttons = this.container.querySelectorAll('.tab-button');
        this.panels = this.container.querySelectorAll('.tab-panel');
        
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');
                this.switchTab(targetId);
            });
        });
    }
    
    switchTab(targetId) {
        // Update buttons
        this.buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === targetId) {
                btn.classList.add('active');
            }
        });
        
        // Update panels
        this.panels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetId) {
                panel.classList.add('active');
            }
        });
    }
}

// ============================================
// Accordion Component
// ============================================

class Accordion {
    constructor(selector) {
        this.toggles = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }
}

// ============================================
// Form Handler
// ============================================

class FormHandler {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const emailInput = this.form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Joining...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitToMailingList(email);
            
            this.showMessage('Successfully joined the waitlist! Check your email.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    async submitToMailingList(email) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email submitted:', email);
                resolve();
            }, 1000);
        });
    }
    
    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 600;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
            border: 1px solid ${type === 'success' ? '#10B981' : '#F59E0B'};
            color: ${type === 'success' ? '#10B981' : '#F59E0B'};
        `;
        
        // Remove existing message
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add new message
        this.form.appendChild(messageEl);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// ============================================
// Scroll Animations
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll, .reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated', 'active');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.elements.forEach(el => {
                this.observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.elements.forEach(el => {
                el.classList.add('animated', 'active');
            });
        }
    }
}

// ============================================
// Counter Animation
// ============================================

class CounterAnimation {
    constructor(selector) {
        this.counters = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            this.counters.forEach(counter => {
                observer.observe(counter);
            });
        }
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
}

// ============================================
// Modal Handler
// ============================================

class ModalHandler {
    constructor() {
        this.modals = document.querySelectorAll('[data-modal]');
        this.triggers = document.querySelectorAll('[data-modal-trigger]');
        this.init();
    }
    
    init() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-trigger');
                this.openModal(modalId);
            });
        });
        
        this.modals.forEach(modal => {
            const closeBtn = modal.querySelector('[data-modal-close]');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.querySelector(`[data-modal="${modalId}"]`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeAllModals() {
        this.modals.forEach(modal => {
            this.closeModal(modal);
        });
    }
}

// ============================================
// Lazy Loading Images
// ============================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            this.images.forEach(img => {
                observer.observe(img);
            });
        } else {
            // Fallback: load all images immediately
            this.images.forEach(img => {
                this.loadImage(img);
            });
        }
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    }
}

// ============================================
// Copy to Clipboard
// ============================================

function copyToClipboard(text, button) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyFeedback(button);
    }
}

function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = 'rgba(16, 185, 129, 0.2)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// ============================================
// Initialize Everything
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    new Navigation();
    
    // Initialize particle background
    new ParticleBackground('particle-canvas');
    
    // Initialize tabs
    new Tabs('.use-cases-tabs');
    
    // Initialize accordions
    new Accordion('.specs-toggle');
    
    // Initialize form handler
    new FormHandler('#newsletter-form');
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize counter animations
    new CounterAnimation('[data-counter]');
    
    // Initialize modal handler
    new ModalHandler();
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add copy functionality to code blocks
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', () => {
            const text = button.getAttribute('data-copy');
            copyToClipboard(text, button);
        });
    });
    
    console.log('🚀 TWIX Chain landing page initialized');
});

// ============================================
// Performance Monitoring
// ============================================

if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
        });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
}

// ============================================
// Export for module usage (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        ParticleBackground,
        Tabs,
        Accordion,
        FormHandler,
        ScrollAnimations,
        CounterAnimation,
        ModalHandler,
        LazyLoader
    };
}