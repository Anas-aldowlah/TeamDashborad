// ============== LANGUAGE & THEME SUPPORT ==============
const translations = {
    en: {
        projectsTitle: "Projects",
        newProject: "+ New Project",
        team: "Team",
        due: "Due",
        completed: "Completed",
        view: "View",
        edit: "Edit",
        archive: "Archive",
        save: "Save",
        cancel: "Cancel",
        confirmArchive: "Archive Project?",
        archiveMsg: "Are you sure you want to archive this project?"
    },
    ar: {
        projectsTitle: "المشاريع",
        newProject: "+ مشروع جديد",
        team: "الفريق",
        due: "موعد التسليم",
        completed: "مكتمل",
        view: "عرض",
        edit: "تعديل",
        archive: "أرشيف",
        save: "حفظ",
        cancel: "إلغاء",
        confirmArchive: "أرشفة المشروع؟",
        archiveMsg: "هل أنت متأكد من أرشفة هذا المشروع؟"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

function applyLanguage(lang) {
    const t = translations[lang];
    document.querySelector('.page-header h1').textContent = t.projectsTitle;
    document.getElementById('addProjectBtn').textContent = t.newProject;

    document.querySelectorAll('.action-btn.view-btn').forEach(btn => btn.textContent = t.view);
    document.querySelectorAll('.action-btn.edit-btn').forEach(btn => btn.textContent = t.edit);
    document.querySelectorAll('.action-btn.archive-btn').forEach(btn => btn.textContent = t.archive);

    // Modal texts
    document.querySelector('#editModal h3')?.textContent = t.edit;
    document.getElementById('saveEditBtn')?.textContent = t.save;
    document.getElementById('cancelEditBtn')?.textContent = t.cancel;
    document.querySelector('#confirmArchive h3')?.textContent = t.confirmArchive;
    document.querySelector('#confirmArchive p')?.textContent = t.archiveMsg;
    document.getElementById('confirmArchiveBtn')?.textContent = t.archive;
    document.getElementById('cancelArchiveBtn')?.textContent = t.cancel;
}

function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
}

// ============== MODALS ==============
const editModal = document.getElementById('editModal');
const confirmArchiveModal = document.getElementById('confirmArchive');
const closeButtons = document.querySelectorAll('.close');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const cancelArchiveBtn = document.getElementById('cancelArchiveBtn');

closeButtons.forEach(btn => {
    btn.onclick = () => {
        editModal.style.display = 'none';
        confirmArchiveModal.style.display = 'none';
    };
});

cancelEditBtn.onclick = () => editModal.style.display = 'none';
cancelArchiveBtn.onclick = () => confirmArchiveModal.style.display = 'none';

// ============== EVENT LISTENERS ==============
document.getElementById('themeToggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
});

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(currentLang);
    localStorage.setItem('lang', currentLang);
});

// View Project → redirect to detail page (simulated)
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        alert(`Opening Project #${id} details...`);
        // في المستقبل: window.location.href = `project-detail.html?id=${id}`;
    });
});

// Edit Project → open modal
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        document.getElementById('editProjectName').value = `Project #${id}`;
        document.getElementById('editProjectDesc').value = "Edited description...";
        editModal.style.display = 'block';
    });
});

// Archive Project → open confirm modal
document.querySelectorAll('.archive-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        document.getElementById('confirmArchiveBtn').setAttribute('data-id', id);
        confirmArchiveModal.style.display = 'block';
    });
});

document.getElementById('confirmArchiveBtn').addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    alert(`Project #${id} has been archived.`);
    confirmArchiveModal.style.display = 'none';
});

// ============== LOAD ON START ==============
window.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);

    const username = sessionStorage.getItem('username');
    const usernameEl = document.getElementById('currentUsername');
    if (username && usernameEl) {
        usernameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    } else {
        window.location.href = '../login/login.html';
    }
});