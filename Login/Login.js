/**
 * Digital Mind - Login Script
 * ✅ Constants for maintainability
 */
const STORAGE_KEYS = {
    THEME: 'dm_theme',
    LANG: 'dm_lang',
    USERNAME: 'dm_username'
};

const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

const LANGUAGES = {
    EN: 'en',
    AR: 'ar'
};

// Translations Dictionary
const translations = {
    en: {
        subtitle: 'Team Project Management System',
        selectName: 'Select Your Name',
        password: 'Password',
        placeholder: 'Enter password',
        signIn: 'Sign In',
        remember: 'Remember me',
        errors: {
            selectName: 'Please select your name',
            passwordRequired: 'Password is required',
            incorrect: 'Incorrect password',
            serverError: 'Login failed. Please try again.'
        }
    },
    ar: {
        subtitle: 'نظام إدارة مشاريع الفريق',
        selectName: 'اختر اسمك',
        password: 'كلمة المرور',
        placeholder: 'أدخل كلمة المرور',
        signIn: 'تسجيل الدخول',
        remember: 'تذكرني',
        errors: {
            selectName: 'يرجى اختيار اسمك',
            passwordRequired: 'كلمة المرور مطلوبة',
            incorrect: 'كلمة المرور غير صحيحة',
            serverError: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
        }
    }
};

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;

function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // Update ARIA label
    const label = theme === THEMES.LIGHT 
        ? 'Switch to dark mode' 
        : 'Switch to light mode';
    themeToggle.setAttribute('aria-label', label);
}

// Initialize theme
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    applyTheme(currentTheme);
});

// ===== Language Toggle =====
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem(STORAGE_KEYS.LANG) || LANGUAGES.EN;

function applyLanguage(lang) {
    const t = translations[lang];
    const dir = lang === LANGUAGES.AR ? 'rtl' : 'ltr';
    
    // Update HTML attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    
    // Update texts using data-key attributes
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const keys = key.split('.');
        let text = t;
        for (const k of keys) {
            text = text?.[k];
        }
        if (text) {
            el.textContent = text;
        }
    });
    
    // Update placeholder
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.placeholder = t.placeholder;
    }
    
    // Save preference
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    currentLang = lang;
}

// Initialize language
applyLanguage(currentLang);

langToggle?.addEventListener('click', () => {
    const newLang = currentLang === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN;
    applyLanguage(newLang);
});

// ===== Password Toggle =====
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword?.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🔒';
    this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
});

// ===== Loading State =====
function setLoading(isLoading) {
    const btn = document.getElementById('loginBtn');
    if (!btn) return;
    
    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = currentLang === LANGUAGES.AR ? 'جاري الدخول...' : 'Signing in...';
        btn.style.opacity = '0.7';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || (currentLang === LANGUAGES.AR ? 'تسجيل الدخول' : 'Sign In');
        btn.style.opacity = '1';
    }
}

// ===== Error Display =====
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    if (!errorMsg) return;
    
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMsg.classList.remove('visible');
    }, 5000);
}

function clearError() {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.classList.remove('visible');
    }
}

// ===== Form Submit =====
const loginForm = document.getElementById('loginForm');
let isSubmitting = false;

loginForm?.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting) return;
    isSubmitting = true;
    
    clearError();
    setLoading(true);
    
    const username = document.getElementById('userSelect')?.value;
    const password = passwordInput?.value.trim();
    
    // Client-side validation
    if (!username) {
        showError(translations[currentLang].errors.selectName);
        setLoading(false);
        isSubmitting = false;
        return;
    }
    
    if (!password) {
        showError(translations[currentLang].errors.passwordRequired);
        setLoading(false);
        isSubmitting = false;
        return;
    }
    
    try {
        // ⚠️ TODO: Replace with actual server-side authentication
        // This is a placeholder for development only
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 🚫 REMOVE THIS IN PRODUCTION - For demo only
        if (password !== "1234") {
            throw new Error(translations[currentLang].errors.incorrect);
        }
        
        // ✅ Success - Store username for dashboard (temporary)
        sessionStorage.setItem(STORAGE_KEYS.USERNAME, username);
        
        // Redirect to dashboard
        window.location.href = '../Dashboard/dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || translations[currentLang].errors.serverError);
    } finally {
        setLoading(false);
        isSubmitting = false;
    }
});

// ===== Utility: Get Anti-Forgery Token (for ASP.NET) =====
function getAntiForgeryToken() {
    return document.querySelector('[name="__RequestVerificationToken"]')?.value;
}

// ===== Utility: Submit to Server (for future ASP.NET integration) =====
async function submitLoginToServer(userName, password) {
    const response = await fetch('/Auth/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': getAntiForgeryToken() || ''
        },
        body: JSON.stringify({ userName, password })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || 'Login failed');
    }
    
    return result;
}

// ===== Initialize on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization can go here
    console.log('Digital Mind Login initialized 🚀');
});