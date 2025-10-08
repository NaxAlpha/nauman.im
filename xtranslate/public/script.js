// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Language Toggle
const langToggle = document.getElementById('langToggle');
let currentLang = 'en';

// Translation content
const translations = {
    en: {
        // All content is already in English in data-en attributes
    },
    jp: {
        // All content is already in Japanese in data-jp attributes
    }
};

function updateLanguage(lang) {
    currentLang = lang;
    
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        if (lang === 'en') {
            element.textContent = element.getAttribute('data-en');
        } else if (lang === 'jp') {
            element.textContent = element.getAttribute('data-jp');
        }
    });
    
    // Update language toggle active state
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
    
    // Update HTML lang attribute
    html.setAttribute('lang', lang === 'en' ? 'en' : 'ja');
    
    // Save preference
    localStorage.setItem('language', lang);
}

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'jp' : 'en';
    updateLanguage(newLang);
});

// Check for saved language preference
const savedLang = localStorage.getItem('language');
if (savedLang) {
    updateLanguage(savedLang);
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .use-case-card, .faq-item, .step, .privacy-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

