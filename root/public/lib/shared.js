class ThemeSwitch {
    constructor(options = {}) {
        this.toggleId = options.toggleId || 'theme-toggle';
        this.iconSelector = options.iconSelector || 'i';
        this.textSelector = options.textSelector || 'span';
        this.cookieName = options.cookieName || 'theme';
        this.cookieDays = options.cookieDays || 365;
        this.defaultTheme = options.defaultTheme || 'light';
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.themeToggle = document.getElementById(this.toggleId);
        if (!this.themeToggle) {
            console.warn(`Theme toggle element with id "${this.toggleId}" not found`);
            return;
        }
        
        this.themeIcon = this.themeToggle.querySelector(this.iconSelector);
        this.themeText = this.themeToggle.querySelector(this.textSelector);
        
        // Load saved theme or default
        const savedTheme = this.getCookie(this.cookieName) || this.defaultTheme;
        this.updateTheme(savedTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    updateTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (this.themeIcon) this.themeIcon.className = 'fas fa-moon';
            if (this.themeText) this.themeText.textContent = 'Light Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (this.themeIcon) this.themeIcon.className = 'fas fa-sun';
            if (this.themeText) this.themeText.textContent = 'Dark Mode';
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.updateTheme(newTheme);
        this.setCookie(this.cookieName, newTheme, this.cookieDays);
    }
    
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || this.defaultTheme;
    }
    
    setTheme(theme) {
        this.updateTheme(theme);
        this.setCookie(this.cookieName, theme, this.cookieDays);
    }
}

// Professional Timeline Toggle Functionality
function toggleCompany(companyId) {
    const companyItem = document.querySelector(`[data-company="${companyId}"]`);
    if (companyItem) {
        companyItem.classList.toggle('collapsed');
        
        // Save state in localStorage
        const isCollapsed = companyItem.classList.contains('collapsed');
        localStorage.setItem(`company-${companyId}-collapsed`, isCollapsed.toString());
    }
}

// Initialize company timeline states
function initializeCompanyTimelines() {
    const companyItems = document.querySelectorAll('.company-timeline-item');
    
    companyItems.forEach(item => {
        const companyId = item.getAttribute('data-company');
        if (companyId) {
            // Check saved state, default to collapsed
            const savedState = localStorage.getItem(`company-${companyId}-collapsed`);
            const shouldBeCollapsed = savedState !== null ? savedState === 'true' : true;
            
            if (shouldBeCollapsed) {
                item.classList.add('collapsed');
            } else {
                item.classList.remove('collapsed');
            }
        }
    });
}

// Auto-initialize with default settings when script loads
// Can be overridden by calling new ThemeSwitch() with custom options
window.addEventListener('DOMContentLoaded', function() {
    if (!window.themeSwitch) {
        window.themeSwitch = new ThemeSwitch();
    }
    
    // Initialize professional timeline
    initializeCompanyTimelines();
});

// Make toggleCompany function globally available
window.toggleCompany = toggleCompany;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitch;
}

// Also make available globally
window.ThemeSwitch = ThemeSwitch;
