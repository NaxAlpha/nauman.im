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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
            return;
        }

        this.setup();
    }

    setup() {
        this.themeToggle = document.getElementById(this.toggleId);
        if (!this.themeToggle) {
            return;
        }

        this.themeIcon = this.themeToggle.querySelector(this.iconSelector);
        this.themeText = this.themeToggle.querySelector(this.textSelector);

        const savedTheme = this.getStoredTheme() || this.defaultTheme;
        this.updateTheme(savedTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    getStoredTheme() {
        try {
            const storedTheme = window.localStorage.getItem(this.cookieName);
            if (storedTheme) {
                return storedTheme;
            }
        } catch {
            return null;
        }

        return null;
    }

    saveTheme(theme) {
        try {
            window.localStorage.setItem(this.cookieName, theme);
        } catch {
            return;
        }
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            if (this.themeIcon) this.themeIcon.className = 'fas fa-moon';
            if (this.themeText) this.themeText.textContent = 'Light Mode';
        } else {
            if (this.themeIcon) this.themeIcon.className = 'fas fa-sun';
            if (this.themeText) this.themeText.textContent = 'Dark Mode';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || this.defaultTheme;
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.updateTheme(nextTheme);
        this.saveTheme(nextTheme);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (!window.themeSwitch) {
        window.themeSwitch = new ThemeSwitch();
    }
});
