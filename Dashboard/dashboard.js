/**
 * Digital Mind - Dashboard Script
 * ✅ Organized, Secure, and MVC-Ready
 */

// ============== CONSTANTS ==============
const STORAGE_KEYS = {
    THEME: 'dm_theme',
    LANG: 'dm_lang',
    USERNAME: 'dm_username'
};

const SELECTORS = {
    USERNAME: '#currentUsername',
    LANG_TOGGLE: '#langToggle',
    THEME_TOGGLE: '#themeToggle',
    LOGOUT_BTN: '.logout-btn',
    DATA_KEY: '[data-key]',
    DATA_BIND: '[data-bind]',
    TOAST_CONTAINER: '#toastContainer'
};

const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

const LANGUAGES = {
    EN: 'en',
    AR: 'ar'
};

// ============== TRANSLATIONS ==============
const translations = {
    en: {
        dashboardTitle: "Dashboard",
        activeProjects: "Active Projects",
        yourTasks: "Your Tasks",
        upcomingMeetings: "Upcoming Meetings",
        teamStatus: "Team Status",
        online: "Online",
        quickActions: "Quick Actions",
        newTask: "+ New Task",
        newMeeting: "+ New Meeting",
        viewProjects: "View My Projects",
        recentTasks: "Recent Tasks",
        logout: "Logout",
        inProgress: "In Progress",
        completed: "Completed",
        pending: "Pending",
        today: "Today",
        noTasks: "No tasks found",
        toast: {
            success: "Action completed successfully",
            error: "An error occurred. Please try again",
            info: "Notification"
        }
    },
    ar: {
        dashboardTitle: "لوحة التحكم",
        activeProjects: "المشاريع النشطة",
        yourTasks: "مهامك",
        upcomingMeetings: "الاجتماعات القادمة",
        teamStatus: "حالة الفريق",
        online: "متصل",
        quickActions: "إجراءات سريعة",
        newTask: "+ مهمة جديدة",
        newMeeting: "+ اجتماع جديد",
        viewProjects: "عرض مشاريعي",
        recentTasks: "المهام الأخيرة",
        logout: "تسجيل الخروج",
        inProgress: "قيد التنفيذ",
        completed: "مكتمل",
        pending: "معلق",
        today: "اليوم",
        noTasks: "لا توجد مهام",
        toast: {
            success: "تمت العملية بنجاح",
            error: "حدث خطأ. يرجى المحاولة مرة أخرى",
            info: "إشعار"
        }
    }
};

// ============== STATE ==============
let currentLang = localStorage.getItem(STORAGE_KEYS.LANG) || LANGUAGES.EN;
let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;

// ============== THEME FUNCTIONS ==============
function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // Update ARIA label
    const themeToggle = document.querySelector(SELECTORS.THEME_TOGGLE);
    if (themeToggle) {
        const label = theme === THEMES.LIGHT 
            ? 'Switch to dark mode' 
            : 'Switch to light mode';
        themeToggle.setAttribute('aria-label', label);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    applyTheme(currentTheme);
}

// ============== LANGUAGE FUNCTIONS ==============
function applyLanguage(lang) {
    const t = translations[lang];
    const dir = lang === LANGUAGES.AR ? 'rtl' : 'ltr';
    
    // Update HTML attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    
    // Update all elements with data-key attribute
    document.querySelectorAll(SELECTORS.DATA_KEY).forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key] !== undefined) {
            el.textContent = t[key];
        }
    });
    
    // Update language toggle button
    const langToggle = document.querySelector(SELECTORS.LANG_TOGGLE);
    if (langToggle) {
        langToggle.textContent = lang === LANGUAGES.EN ? 'EN' : 'AR';
        langToggle.setAttribute('aria-label', 
            lang === LANGUAGES.EN ? 'Switch to Arabic' : 'Switch to English'
        );
    }
    
    // Save preference
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    currentLang = lang;
}

function toggleLanguage() {
    const newLang = currentLang === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN;
    applyLanguage(newLang);
}

// ============== USER FUNCTIONS ==============
function loadUsername() {
    const username = sessionStorage.getItem(STORAGE_KEYS.USERNAME);
    const usernameEl = document.querySelector(SELECTORS.USERNAME);
    
    if (!username) {
        // No user logged in - redirect to login
        handleUnauthorized();
        return null;
    }
    
    if (usernameEl) {
        // Format: first letter uppercase
        usernameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
    }
    
    return username;
}

function handleUnauthorized() {
    // Clear any残留 data
    sessionStorage.clear();
    
    // Redirect with return URL
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/Login?returnUrl=${returnUrl}`;
}

function logout() {
    // Clear session
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/Auth/Logout';
}

// ============== TOAST NOTIFICATIONS ==============
function showToast(message, type = 'info', duration = 4000) {
    const container = document.querySelector(SELECTORS.TOAST_CONTAINER);
    if (!container) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove
    const timeoutId = setTimeout(() => {
        toast.remove();
    }, duration);
    
    // Manual close
    toast.querySelector('.toast-close')?.addEventListener('click', () => {
        clearTimeout(timeoutId);
        toast.remove();
    });
    
    return toast;
}

// ============== DATA BINDING (for ASP.NET MVC) ==============
function bindData(data) {
    if (!data || typeof data !== 'object') return;
    
    document.querySelectorAll(SELECTORS.DATA_BIND).forEach(el => {
        const key = el.getAttribute('data-bind');
        if (data[key] !== undefined && data[key] !== null) {
            el.textContent = data[key];
        }
    });
}

// ============== API HELPERS (for future backend integration) ==============
function getAntiForgeryToken() {
    return document.querySelector('[name="__RequestVerificationToken"]')?.value;
}

async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': getAntiForgeryToken() || ''
        }
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        
        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return null;
    } catch (error) {
        console.error('API Request Error:', error);
        showToast(translations[currentLang].toast.error, 'error');
        throw error;
    }
}

// ============== EVENT LISTENERS ==============
function setupEventListeners() {
    // Theme Toggle
    document.querySelector(SELECTORS.THEME_TOGGLE)?.addEventListener('click', toggleTheme);
    
    // Language Toggle
    document.querySelector(SELECTORS.LANG_TOGGLE)?.addEventListener('click', toggleLanguage);
    
    // Logout Button
    document.querySelector(SELECTORS.LOGOUT_BTN)?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // Quick Action Buttons
    document.querySelectorAll('.action-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const actions = ['newTask', 'newMeeting', 'viewProjects'];
            const action = actions[index];
            
            // TODO: Implement actual actions or navigate
            showToast(`Action: ${action}`, 'info', 2000);
            
            // Example navigation:
            // if (action === 'newTask') window.location.href = '/Tasks/Create';
        });
        
        // Keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

// ============== INITIALIZATION ==============
function init() {
    // Apply saved preferences
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    
    // Load and verify user
    const username = loadUsername();
    if (!username) return; // Redirect handled in loadUsername
    
    // Setup interactions
    setupEventListeners();
    
    // TODO: Fetch dynamic data from server
    // fetchDashboardData().then(data => {
    //     if (data) bindData(data);
    // });
    
    console.log('✅ Digital Mind Dashboard initialized');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============== EXPORTS (for testing/modularity) ==============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyTheme,
        applyLanguage,
        toggleTheme,
        toggleLanguage,
        loadUsername,
        showToast,
        bindData,
        apiRequest
    };
}