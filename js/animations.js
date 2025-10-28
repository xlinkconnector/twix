// ============================================
// TWIX Chain - Advanced Animations
// Additional animation effects and interactions
// ============================================

// ============================================
// Parallax Scrolling Effect
// ============================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            this.update();
        });
        
        this.update();
    }
    
    update() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// Typing Animation Effect
// ============================================

class TypingEffect {
    constructor(selector, options = {}) {
        this.element = document.querySelector(selector);
        if (!this.element) return;
        
        this.text = this.element.textContent;
        this.element.textContent = '';
        this.speed = options.speed || 50;
        this.delay = options.delay || 0;
        this.cursor = options.cursor !== false;
        this.index = 0;
        
        this.init();
    }
    
    init() {
        if (this.cursor) {
            this.element.style.borderRight = '2px solid var(--color-cyan)';
            this.element.style.paddingRight = '5px';
        }
        
        setTimeout(() => {
            this.type();
        }, this.delay);
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.cursor) {
            this.element.style.animation = 'blink 1s step-end infinite';
        }
    }
}

// ============================================
// Number Counter with Easing
// ============================================

class EasingCounter {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-target')) || 0;
        this.duration = options.duration || 2000;
        this.easing = options.easing || this.easeOutExpo;
        this.suffix = element.getAttribute('data-suffix') || '';
        this.prefix = element.getAttribute('data-prefix') || '';
        this.decimals = parseInt(element.getAttribute('data-decimals')) || 0;
    }
    
    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    animate() {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = this.easing(progress);
            const current = Math.floor(easedProgress * this.target);
            
            this.element.textContent = this.prefix + 
                current.toLocaleString(undefined, {
                    minimumFractionDigits: this.decimals,
                    maximumFractionDigits: this.decimals
                }) + this.suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ============================================
// Gradient Animation on Scroll
// ============================================

class ScrollGradient {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.update();
        });
        
        this.update();
    }
    
    update() {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.element.style.background = `linear-gradient(135deg, 
            hsl(${scrollPercent * 3.6}, 70%, 50%) 0%, 
            hsl(${(scrollPercent * 3.6 + 60) % 360}, 70%, 50%) 100%)`;
    }
}

// ============================================
// Magnetic Button Effect
// ============================================

class MagneticButton {
    constructor(selector) {
        this.buttons = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.handleMouseLeave(button);
            });
        });
    }
    
    handleMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height);
        
        if (distance < maxDistance) {
            const strength = 0.3;
            button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        }
    }
    
    handleMouseLeave(button) {
        button.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// Tilt Effect on Hover
// ============================================

class TiltEffect {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.maxTilt = options.maxTilt || 15;
        this.perspective = options.perspective || 1000;
        this.scale = options.scale || 1.05;
        
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            element.style.transformStyle = 'preserve-3d';
            element.style.transition = 'transform 0.3s ease-out';
            
            element.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.handleMouseLeave(element);
            });
        });
    }
    
    handleMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * this.maxTilt;
        const rotateY = ((centerX - x) / centerX) * this.maxTilt;
        
        element.style.transform = `
            perspective(${this.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${this.scale})
        `;
    }
    
    handleMouseLeave(element) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
}

// ============================================
// Cursor Trail Effect
// ============================================

class CursorTrail {
    constructor(options = {}) {
        this.particles = [];
        this.maxParticles = options.maxParticles || 20;
        this.color = options.color || 'rgba(0, 229, 255, 0.5)';
        this.size = options.size || 4;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addParticle(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: ${this.size}px;
            height: ${this.size}px;
            background: ${this.color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(particle);
        this.particles.push({ element: particle, life: 1 });
        
        if (this.particles.length > this.maxParticles) {
            const removed = this.particles.shift();
            removed.element.remove();
        }
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.element.style.opacity = particle.life;
            particle.element.style.transform = `translate(-50%, -50%) scale(${particle.life})`;
            
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Stagger Animation on Scroll
// ============================================

class StaggerAnimation {
    constructor(selector, options = {}) {
        this.containers = document.querySelectorAll(selector);
        this.delay = options.delay || 100;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateChildren(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            this.containers.forEach(container => {
                observer.observe(container);
            });
        }
    }
    
    animateChildren(container) {
        const children = Array.from(container.children);
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
            }, index * this.delay);
        });
    }
}

// ============================================
// Smooth Scroll Progress Bar
// ============================================

class ScrollProgress {
    constructor(selector) {
        this.bar = document.querySelector(selector);
        if (!this.bar) {
            this.createBar();
        }
        this.init();
    }
    
    createBar() {
        this.bar = document.createElement('div');
        this.bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--color-cyan), var(--color-violet));
            z-index: 9999;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(this.bar);
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.update();
        });
        this.update();
    }
    
    update() {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.bar.style.width = `${scrollPercent}%`;
    }
}

// ============================================
// Text Reveal Animation
// ============================================

class TextReveal {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 0.6s ease-out forwards;
                    animation-delay: ${index * 0.05}s;
                `;
                element.appendChild(span);
            });
        });
    }
}

// ============================================
// Image Zoom on Hover
// ============================================

class ImageZoom {
    constructor(selector) {
        this.images = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.images.forEach(img => {
            const container = img.parentElement;
            container.style.overflow = 'hidden';
            
            img.style.transition = 'transform 0.5s ease-out';
            
            container.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            
            container.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }
}

// ============================================
// Ripple Effect on Click
// ============================================

class RippleEffect {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }
    
    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize Advanced Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Initialize scroll progress bar
    new ScrollProgress();
    
    // Initialize magnetic buttons
    new MagneticButton('.btn-primary');
    
    // Initialize tilt effect on cards
    new TiltEffect('.feature-card, .problem-card, .use-case-content');
    
    // Initialize stagger animations
    new StaggerAnimation('.features-grid');
    new StaggerAnimation('.problem-grid');
    new StaggerAnimation('.team-grid');
    
    // Initialize ripple effect on buttons
    new RippleEffect('.btn');
    
    // Initialize image zoom
    new ImageZoom('.use-case-visual img');
    
    // Optional: Initialize cursor trail (uncomment if desired)
    // new CursorTrail({ maxParticles: 15, size: 3 });
    
    console.log('✨ Advanced animations initialized');
});

// ============================================
// Export for module usage
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParallaxEffect,
        TypingEffect,
        EasingCounter,
        ScrollGradient,
        MagneticButton,
        TiltEffect,
        CursorTrail,
        StaggerAnimation,
        ScrollProgress,
        TextReveal,
        ImageZoom,
        RippleEffect
    };
}