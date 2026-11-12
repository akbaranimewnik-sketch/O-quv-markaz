/* ==========================================================
   RENESANS O'QUV MARKAZI - APPLICATION CORE LOGIC
   Role management, dynamic views, modals, notifications
   ========================================================== */

// Application State
const state = {
    currentRole: 'admin', // 'admin', 'manager', 'teacher'
    currentSection: 'dashboard', // contextual to active role
    searchQuery: '',
    selectedTeacherId: 't-1', // default teacher for teacher panel view
    selectedAttendanceGroup: 'g-1',
    selectedAttendanceDate: new Date().toISOString().split('T')[0]
};

// UI Elements Cache
const DOM = {
    app: document.getElementById('app'),
    sidebar: document.getElementById('sidebar'),
    sidebarNav: document.getElementById('sidebarNav'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    mobileSidebarClose: document.getElementById('mobileSidebarClose'),
    sidebarRoleName: document.getElementById('sidebarRoleName'),
    sidebarRoleAvatar: document.getElementById('sidebarRoleAvatar'),
    miniStudentCount: document.getElementById('miniStudentCount'),
    miniGroupCount: document.getElementById('miniGroupCount'),
    btnResetDemoData: document.getElementById('btnResetDemoData'),
    pageMainHeading: document.getElementById('pageMainHeading'),
    pageSubHeading: document.getElementById('pageSubHeading'),
    contentView: document.getElementById('contentView'),
    roleSwitcher: document.getElementById('roleSwitcher'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalCard: document.getElementById('modalCard'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    toastContainer: document.getElementById('toastContainer'),
    dateText: document.getElementById('dateText')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCurrentDate();
    initEventListeners();
    setRole(localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'admin');
    updateMiniStats();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        DOM.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        DOM.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        DOM.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    } else {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        DOM.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }
}

function initCurrentDate() {
    const now = new Date();
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    DOM.dateText.textContent = `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()}`;
}

// Formatters
function formatMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
}

function cleanPhone(phone) {
    return (phone || '').replace(/[^0-9+]/g, '');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');
    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${type === 'success' ? 'var(--success)' : (type === 'error' ? 'var(--danger)' : 'var(--primary)')}; font-size: 18px;"></i>
        <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function updateMiniStats() {
    const students = db.getStudents();
    const groups = db.getGroups();
    if (DOM.miniStudentCount) DOM.miniStudentCount.textContent = students.length;
    if (DOM.miniGroupCount) DOM.miniGroupCount.textContent = groups.length;
}

// Event Listeners
function initEventListeners() {
    // Role switcher buttons
    DOM.roleSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.role-btn');
        if (!btn) return;
        const role = btn.getAttribute('data-role');
        setRole(role);
    });

    // Theme toggle
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);

    // Sidebar Mobile
    DOM.sidebarToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
    });

    DOM.mobileSidebarClose.addEventListener('click', () => {
        DOM.sidebar.classList.remove('open');
    });

    // Modal Close
    DOM.modalCloseBtn.addEventListener('click', closeModal);
    DOM.modalOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.modalOverlay) closeModal();
    });

    // Global Search
    DOM.globalSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderView();
    });

    // Reset Demo Data
    DOM.btnResetDemoData.addEventListener('click', () => {
        if (confirm("Haqiqatan ham barcha test ma'lumotlarini dastlabki holatga qaytarmoqchimisiz?")) {
            db.resetAll();
            updateMiniStats();
            renderView();
            showToast("Barcha test ma'lumotlari muvaffaqiyatli tiklandi!", "info");
        }
    });
}

// Role Changing Handler
function setRole(role) {
    state.currentRole = role;
    state.currentSection = 'dashboard';
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);

    // Update active button state
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    // Update sidebar appearance & text
    if (role === 'admin') {
        DOM.sidebarRoleName.textContent = 'Bosh Administrator';
        DOM.sidebarRoleAvatar.innerHTML = '<i class="fa-solid fa-user-shield"></i>';
        DOM.pageMainHeading.textContent = 'Admin Boshqaruv Markazi';
        DOM.pageSubHeading.textContent = "O'qituvchilar, o'quvchilar, telefon raqamlar va davomat monitoringi";
    } else if (role === 'manager') {
        DOM.sidebarRoleName.textContent = 'Bosh Menijer';
        DOM.sidebarRoleAvatar.innerHTML = '<i class="fa-solid fa-chart-pie"></i>';
        DOM.pageMainHeading.textContent = 'Menijer Moliya va Statistika Paneli';
        DOM.pageSubHeading.textContent = "Kirim-chiqimlar, kassa balansi va o'quvchilar soni hisoboti";
    } else {
        DOM.sidebarRoleName.textContent = "O'qituvchi Shaxsiy Paneli";
        DOM.sidebarRoleAvatar.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i>';
        DOM.pageMainHeading.textContent = "O'qituvchi Ish Stoli";
        DOM.pageSubHeading.textContent = "Guruhlar, kunlik davomat olish va o'quvchilar ro'yxati";
    }

    renderSidebarNav();
    renderView();
    updateMiniStats();
}

// Sidebar Navigation Renderer per Role
function renderSidebarNav() {
    let navHtml = '';

    if (state.currentRole === 'admin') {
        navHtml = `
            <span class="nav-section-title">Asosiy Bo'limlar</span>
            <a href="#" class="nav-link ${state.currentSection === 'dashboard' ? 'active' : ''}" data-section="dashboard">
                <i class="fa-solid fa-chart-line"></i> Boshqaruv Paneli
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'students' ? 'active' : ''}" data-section="students">
                <i class="fa-solid fa-user-graduate"></i> O'quvchilar Ro'yxati
                <span class="nav-badge">${db.getStudents().length}</span>
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'teachers' ? 'active' : ''}" data-section="teachers">
                <i class="fa-solid fa-chalkboard-user"></i> O'qituvchilar
                <span class="nav-badge">${db.getTeachers().length}</span>
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'attendance' ? 'active' : ''}" data-section="attendance">
                <i class="fa-solid fa-calendar-check"></i> Davomat Monitoringi
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'groups' ? 'active' : ''}" data-section="groups">
                <i class="fa-solid fa-users-rectangle"></i> Guruhlar & Kurslar
                <span class="nav-badge">${db.getGroups().length}</span>
            </a>
        `;
    } else if (state.currentRole === 'manager') {
        const fin = db.getFinancialSummary();
        navHtml = `
            <span class="nav-section-title">Moliya & Statistika</span>
            <a href="#" class="nav-link ${state.currentSection === 'dashboard' ? 'active' : ''}" data-section="dashboard">
                <i class="fa-solid fa-vault"></i> Moliya Boshqaruvi
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'incomes-expenses' ? 'active' : ''}" data-section="incomes-expenses">
                <i class="fa-solid fa-money-bill-transfer"></i> Kirim & Chiqimlar
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'debtors' ? 'active' : ''}" data-section="debtors">
                <i class="fa-solid fa-hand-holding-dollar"></i> Qarzdorlar Ro'yxati
                <span class="nav-badge danger">${fin.totalDebtorsCount}</span>
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'students-stats' ? 'active' : ''}" data-section="students-stats">
                <i class="fa-solid fa-users"></i> O'quvchilar Statistikasi
                <span class="nav-badge">${fin.totalStudents}</span>
            </a>
        `;
    } else {
        // Teacher panel
        navHtml = `
            <span class="nav-section-title">O'qituvchi Bo'limlari</span>
            <a href="#" class="nav-link ${state.currentSection === 'dashboard' ? 'active' : ''}" data-section="dashboard">
                <i class="fa-solid fa-chalkboard"></i> Mening Guruhlarim
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'take-attendance' ? 'active' : ''}" data-section="take-attendance">
                <i class="fa-solid fa-clipboard-user"></i> Davomat Olish
            </a>
            <a href="#" class="nav-link ${state.currentSection === 'my-students' ? 'active' : ''}" data-section="my-students">
                <i class="fa-solid fa-address-book"></i> O'quvchilarim & Telefonlar
            </a>
        `;
    }

    DOM.sidebarNav.innerHTML = navHtml;

    // Attach click handlers to nav links
    DOM.sidebarNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            state.currentSection = section;
            DOM.sidebarNav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (window.innerWidth <= 860) DOM.sidebar.classList.remove('open');
            renderView();
        });
    });
}

// Render dynamic view according to Role & Section
function renderView() {
    if (state.currentRole === 'admin') {
        renderAdminView();
    } else if (state.currentRole === 'manager') {
        renderManagerView();
    } else {
        renderTeacherView();
    }
}

/* ==========================================================
   ADMIN PANEL VIEWS
   ========================================================== */
function renderAdminView() {
    const students = db.getStudents();
    const teachers = db.getTeachers();
    const groups = db.getGroups();
    const attendance = db.getAttendance();

    if (state.currentSection === 'dashboard') {
        DOM.contentView.innerHTML = `
            <!-- Role Welcome Banner -->
            <div class="role-banner">
                <div class="role-banner-content">
                    <h2><i class="fa-solid fa-user-shield"></i> Administrator Boshqaruv Tizimi</h2>
                    <p>O'qituvchilar va o'quvchilarni qo'shing, o'quvchilarning telefon raqamlarini to'g'ridan-to'g'ri ko'ring va o'qituvchilar yuborgan davomatni real vaqtda kuzating.</p>
                </div>
                <div class="role-banner-actions">
                    <button class="btn btn-primary" onclick="openAddStudentModal()"><i class="fa-solid fa-user-plus"></i> O'quvchi Qo'shish</button>
                    <button class="btn btn-secondary" onclick="openAddTeacherModal()"><i class="fa-solid fa-user-tie"></i> O'qituvchi Qo'shish</button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon primary"><i class="fa-solid fa-user-graduate"></i></div>
                    <div class="stat-info">
                        <span>Jami O'quvchilar</span>
                        <h3>${students.length} nafar</h3>
                        <span class="stat-badge positive"><i class="fa-solid fa-arrow-up"></i> Faol: ${students.filter(s=>s.status==='active').length}</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fa-solid fa-chalkboard-user"></i></div>
                    <div class="stat-info">
                        <span>O'qituvchilar Soni</span>
                        <h3>${teachers.length} nafar</h3>
                        <span class="stat-badge neutral">Malakali ustozlar</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon success"><i class="fa-solid fa-users-rectangle"></i></div>
                    <div class="stat-info">
                        <span>Faol Guruhlar</span>
                        <h3>${groups.length} ta guruh</h3>
                        <span class="stat-badge positive">Barcha yo'nalishlar</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon warning"><i class="fa-solid fa-calendar-check"></i></div>
                    <div class="stat-info">
                        <span>Kiritilgan Davomatlar</span>
                        <h3>${attendance.length} ta dars</h3>
                        <span class="stat-badge positive">Real-vaqt monitoring</span>
                    </div>
                </div>
            </div>

            <!-- Quick Table 1: Students with Phone Numbers -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-address-book" style="color: var(--primary);"></i> O'quvchilar va Ularning Telefon Raqamlari</h3>
                        <p>O'quvchilarning shaxsiy va ota-onalarining telefon raqamlari aniq ko'rsatilgan</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-sm" onclick="openAddStudentModal()"><i class="fa-solid fa-plus"></i> Yangi O'quvchi</button>
                        <button class="btn btn-secondary btn-sm" onclick="navigateToSection('students')">Barchasini Ko'rish</button>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderStudentsTableHTML(students.slice(0, 5))}
                </div>
            </div>

            <!-- Quick Table 2: Recent Attendance submitted by Teachers -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-clipboard-check" style="color: var(--success);"></i> O'qituvchilar Qilgan Oxirgi Davomatlar</h3>
                        <p>O'qituvchilar kiritgan davomatlar avtomatik admin panelda aks etadi</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-sm" onclick="navigateToSection('attendance')">To'liq Davomat Monitoringi</button>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderAttendanceSummaryTableHTML(attendance.slice(0, 5))}
                </div>
            </div>
        `;
    } else if (state.currentSection === 'students') {
        const filtered = filterList(students, ['name', 'phone', 'parentPhone']);
        DOM.contentView.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-user-graduate" style="color: var(--primary);"></i> Barcha O'quvchilar Ro'yxati (${filtered.length})</h3>
                        <p>Har bir o'quvchining o'z telefon raqami, guruhi va to'lov holati</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="openAddStudentModal()"><i class="fa-solid fa-user-plus"></i> Yangi O'quvchi Qo'shish</button>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderStudentsTableHTML(filtered, true)}
                </div>
            </div>
        `;
    } else if (state.currentSection === 'teachers') {
        const filtered = filterList(teachers, ['name', 'phone', 'subject']);
        DOM.contentView.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-chalkboard-user" style="color: var(--purple);"></i> O'qituvchilar Ro'yxati (${filtered.length})</h3>
                        <p>O'quv markaz o'qituvchilari, ularning fani, oylik maoshi va kontaktlari</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="openAddTeacherModal()"><i class="fa-solid fa-user-tie"></i> Yangi O'qituvchi Qo'shish</button>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderTeachersTableHTML(filtered)}
                </div>
            </div>
        `;
    } else if (state.currentSection === 'attendance') {
        DOM.contentView.innerHTML = renderAdminAttendanceSectionHTML();
        attachAdminAttendanceFilters();
    } else if (state.currentSection === 'groups') {
        DOM.contentView.innerHTML = renderGroupsSectionHTML();
    }
}

// Student Table HTML Generator (Emphasizing Student Phone Numbers)
function renderStudentsTableHTML(studentsList, fullActions = false) {
    if (!studentsList.length) {
        return `<div style="padding: 40px; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-magnifying-glass" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>Hech qanday o'quvchi topilmadi</div>`;
    }

    const rows = studentsList.map(s => {
        const group = db.getGroupById(s.groupId) || { name: 'Guruhsiz' };
        const cleanTel = cleanPhone(s.phone);
        const cleanParent = cleanPhone(s.parentPhone);

        let badgeClass = 'badge-success';
        let badgeText = "To'langan";
        if (s.paymentStatus === 'debt') {
            badgeClass = 'badge-danger';
            badgeText = `Qarzdor (${formatMoney(s.debtAmount)})`;
        } else if (s.paymentStatus === 'partial') {
            badgeClass = 'badge-warning';
            badgeText = `Qisman (${formatMoney(s.debtAmount)})`;
        }

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-cell-avatar">${s.avatar || 'OQ'}</div>
                        <div class="user-cell-info">
                            <strong>${s.name}</strong>
                            <span>Qo'shilgan: ${s.joinDate || 'Noma\'lum'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <!-- O'quvchining O'zining Telefon Raqami -->
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="phone-chip" title="O'quvchining shaxsiy telefoni">
                            <i class="fa-solid fa-phone"></i>
                            <strong>${s.phone}</strong>
                        </span>
                        <div class="phone-quick-actions">
                            <a href="tel:${cleanTel}" class="action-icon-btn call" title="Qo'ng'iroq qilish">
                                <i class="fa-solid fa-phone-volume"></i>
                            </a>
                            <a href="https://t.me/${cleanTel}" target="_blank" class="action-icon-btn tg" title="Telegramdan yozish">
                                <i class="fa-brands fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                    ${s.parentPhone ? `
                        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px; padding-left: 4px;">
                            <i class="fa-solid fa-person-breastfeeding"></i> Ota-onasi: 
                            <a href="tel:${cleanParent}" style="color: var(--text-secondary); text-decoration: underline;">${s.parentPhone}</a>
                        </div>
                    ` : ''}
                </td>
                <td>
                    <span class="badge badge-purple"><i class="fa-solid fa-book-open"></i> ${group.name}</span>
                </td>
                <td>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="openEditStudentModal('${s.id}')" title="Tahrirlash">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    ${fullActions ? `
                        <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="deleteStudent('${s.id}')" title="O'chirish">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>O'quvchi F.I.Sh</th>
                        <th>O'quvchining Telefon Raqami</th>
                        <th>Guruhi / Fani</th>
                        <th>To'lov Holati</th>
                        <th style="text-align: right;">Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Teachers Table HTML Generator
function renderTeachersTableHTML(teachersList) {
    if (!teachersList.length) {
        return `<div style="padding: 40px; text-align: center; color: var(--text-muted);">O'qituvchilar topilmadi</div>`;
    }

    const rows = teachersList.map(t => {
        const groups = db.getGroups().filter(g => g.teacherId === t.id);
        const cleanTel = cleanPhone(t.phone);
        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-cell-avatar" style="background: linear-gradient(135deg, #10b981, #06b6d4);">${t.avatar || 'UQ'}</div>
                        <div class="user-cell-info">
                            <strong>${t.name}</strong>
                            <span>Tajriba: ${t.experience || '2 yil'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="phone-chip">
                            <i class="fa-solid fa-phone"></i>
                            <strong>${t.phone}</strong>
                        </span>
                        <a href="tel:${cleanTel}" class="action-icon-btn call" title="Qo'ng'iroq qilish">
                            <i class="fa-solid fa-phone-volume"></i>
                        </a>
                        <a href="https://t.me/${cleanTel}" target="_blank" class="action-icon-btn tg" title="Telegram">
                            <i class="fa-brands fa-telegram"></i>
                        </a>
                    </div>
                </td>
                <td>
                    <strong style="color: var(--primary);">${t.subject}</strong>
                </td>
                <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${groups.map(g => `<span class="badge badge-secondary">${g.name}</span>`).join('') || '<span class="text-muted">Guruh yo\'q</span>'}
                    </div>
                </td>
                <td>
                    <strong>${formatMoney(t.salary)}</strong>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="openEditTeacherModal('${t.id}')" title="Tahrirlash">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="deleteTeacher('${t.id}')" title="O'chirish">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>O'qituvchi F.I.Sh</th>
                        <th>Telefon Raqami</th>
                        <th>Mutaxassisligi / Fani</th>
                        <th>Biriktirilgan Guruhlari</th>
                        <th>Oylik Maoshi</th>
                        <th style="text-align: right;">Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Attendance Summary Table for Admin
function renderAttendanceSummaryTableHTML(attendanceList) {
    if (!attendanceList.length) {
        return `<div style="padding: 40px; text-align: center; color: var(--text-muted);">Hozircha hech qanday davomat yozilmagan</div>`;
    }

    const rows = attendanceList.map(a => {
        const group = db.getGroupById(a.groupId) || { name: 'Guruh' };
        const teacher = db.getTeacherById(a.teacherId) || { name: 'O\'qituvchi' };
        const records = a.records || {};
        const totalInGroup = Object.keys(records).length;
        const presentCount = Object.values(records).filter(status => status === 'present').length;
        const absentCount = Object.values(records).filter(status => status === 'absent').length;
        const excusedCount = Object.values(records).filter(status => status === 'excused').length;
        const lateCount = Object.values(records).filter(status => status === 'late').length;

        const percent = totalInGroup > 0 ? Math.round((presentCount / totalInGroup) * 100) : 0;

        return `
            <tr>
                <td>
                    <strong><i class="fa-regular fa-calendar" style="color: var(--primary);"></i> ${a.date}</strong>
                </td>
                <td>
                    <strong>${group.name}</strong>
                </td>
                <td>
                    <span class="badge badge-purple"><i class="fa-solid fa-chalkboard-user"></i> ${teacher.name}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <span class="badge badge-success" title="Keldi"><i class="fa-solid fa-check"></i> ${presentCount}</span>
                        <span class="badge badge-danger" title="Kelmadi"><i class="fa-solid fa-xmark"></i> ${absentCount}</span>
                        ${excusedCount ? `<span class="badge badge-warning" title="Sababli">${excusedCount}</span>` : ''}
                        ${lateCount ? `<span class="badge badge-purple" title="Kechikdi">${lateCount}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="flex: 1; height: 8px; background: var(--bg-hover); border-radius: 4px; overflow: hidden; width: 80px;">
                            <div style="width: ${percent}%; height: 100%; background: ${percent > 70 ? 'var(--success)' : (percent > 40 ? 'var(--warning)' : 'var(--danger)')};"></div>
                        </div>
                        <strong style="font-size: 12.5px;">${percent}%</strong>
                    </div>
                </td>
                <td style="max-width: 200px; font-size: 12.5px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${a.notes || 'Izoh qoldirilmagan'}
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="viewAttendanceDetailsModal('${a.id}')">
                        <i class="fa-solid fa-eye"></i> Ko'rish
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Sana</th>
                        <th>Guruh Nomi</th>
                        <th>Davomat Qilgan Ustoz</th>
                        <th>Ko'rsatkich</th>
                        <th>Davomat %</th>
                        <th>Mavzu / Izoh</th>
                        <th style="text-align: right;">Batafsil</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Admin Full Attendance Monitoring Section
function renderAdminAttendanceSectionHTML() {
    const groups = db.getGroups();
    const attendance = db.getAttendance();

    return `
        <div class="dashboard-card">
            <div class="card-header">
                <div class="card-title-group">
                    <h3><i class="fa-solid fa-calendar-check" style="color: var(--primary);"></i> Davomat Monitoringi Markazi</h3>
                    <p>O'qituvchilar dars vaqtida olgan barcha davomat natijalarini guruh va sana bo'yicha ko'rish</p>
                </div>
            </div>
            <div class="card-body">
                <!-- Filters Bar -->
                <div class="attendance-filters-bar">
                    <div class="filter-group">
                        <label><i class="fa-solid fa-users"></i> Guruh bo'yicha:</label>
                        <select class="form-select" id="adminAttFilterGroup">
                            <option value="all">Barcha Guruhlar</option>
                            ${groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label><i class="fa-regular fa-calendar"></i> Sana bo'yicha:</label>
                        <input type="date" class="form-input" id="adminAttFilterDate" value="">
                    </div>

                    <div class="filter-group">
                        <button class="btn btn-secondary btn-sm" id="btnAdminAttResetFilters">
                            <i class="fa-solid fa-rotate"></i> Filtrlarni tozalash
                        </button>
                    </div>
                </div>

                <div id="adminAttendanceTableContainer" style="margin-top: 20px;">
                    ${renderAttendanceSummaryTableHTML(attendance)}
                </div>
            </div>
        </div>
    `;
}

function attachAdminAttendanceFilters() {
    const groupSelect = document.getElementById('adminAttFilterGroup');
    const dateInput = document.getElementById('adminAttFilterDate');
    const resetBtn = document.getElementById('btnAdminAttResetFilters');
    const container = document.getElementById('adminAttendanceTableContainer');

    function applyFilter() {
        let list = db.getAttendance();
        const selGroup = groupSelect.value;
        const selDate = dateInput.value;

        if (selGroup !== 'all') {
            list = list.filter(a => a.groupId === selGroup);
        }
        if (selDate) {
            list = list.filter(a => a.date === selDate);
        }
        container.innerHTML = renderAttendanceSummaryTableHTML(list);
    }

    if (groupSelect) groupSelect.addEventListener('change', applyFilter);
    if (dateInput) dateInput.addEventListener('change', applyFilter);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        groupSelect.value = 'all';
        dateInput.value = '';
        applyFilter();
    });
}

// Groups & Courses Section
function renderGroupsSectionHTML() {
    const groups = db.getGroups();
    const students = db.getStudents();

    const cards = groups.map(g => {
        const teacher = db.getTeacherById(g.teacherId) || { name: 'Tayinlanmagan' };
        const groupStudents = students.filter(s => s.groupId === g.id);

        return `
            <div class="stat-card" style="display: flex; flex-direction: column; align-items: flex-start;">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 12px;">
                    <span class="badge badge-primary"><i class="fa-solid fa-bookmark"></i> ${g.subject}</span>
                    <strong style="color: var(--primary); font-size: 15px;">${formatMoney(g.price)}/oy</strong>
                </div>
                <h3 style="font-size: 18px; margin-bottom: 8px;">${g.name}</h3>
                <div style="display: flex; flex-direction: column; gap: 6px; width: 100%; font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                    <div><i class="fa-solid fa-chalkboard-user" style="color: var(--primary); width: 20px;"></i> O'qituvchi: <strong>${teacher.name}</strong></div>
                    <div><i class="fa-solid fa-calendar-days" style="color: var(--primary); width: 20px;"></i> Kunlari: ${g.days}</div>
                    <div><i class="fa-solid fa-clock" style="color: var(--primary); width: 20px;"></i> Vaqti: ${g.time} (${g.room})</div>
                    <div><i class="fa-solid fa-user-graduate" style="color: var(--primary); width: 20px;"></i> O'quvchilar: <strong>${groupStudents.length} nafar</strong></div>
                </div>
                <div style="display: flex; gap: 8px; width: 100%;">
                    <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="openAddStudentModal('${g.id}')">
                        <i class="fa-solid fa-user-plus"></i> O'quvchi qo'shish
                    </button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="dashboard-card">
            <div class="card-header">
                <div class="card-title-group">
                    <h3><i class="fa-solid fa-users-rectangle" style="color: var(--primary);"></i> O'quv Markazdagi Guruhlar & Kurslar (${groups.length})</h3>
                    <p>Mavjud barcha guruhlar, ularning o'qituvchilari va o'quvchilar soni</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="openAddGroupModal()"><i class="fa-solid fa-plus"></i> Yangi Guruh Ochish</button>
                </div>
            </div>
            <div class="card-body">
                <div class="stats-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
                    ${cards}
                </div>
            </div>
        </div>
    `;
}

/* ==========================================================
   MENIJER (MANAGER) PANEL VIEWS
   Finance, Income/Expense, Debtors, Student Analytics
   ========================================================== */
function renderManagerView() {
    const fin = db.getFinancialSummary();
    const students = db.getStudents();
    const financeList = db.getFinance();

    if (state.currentSection === 'dashboard' || state.currentSection === 'incomes-expenses') {
        DOM.contentView.innerHTML = `
            <!-- Role Welcome Banner -->
            <div class="role-banner" style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%);">
                <div class="role-banner-content">
                    <h2><i class="fa-solid fa-vault"></i> Menijer Moliya va O'quvchilar Boshqaruvi</h2>
                    <p>O'quv markazning barcha kirim-chiqimlari, kassa balansi, to'lovlar oqimi va nechta o'quvchi o'qiyotgani haqidagi to'liq statistik ma'lumotlar.</p>
                </div>
                <div class="role-banner-actions">
                    <button class="btn btn-success" onclick="openAddIncomeModal()"><i class="fa-solid fa-arrow-down-long"></i> Kirim (To'lov) Kiritish</button>
                    <button class="btn btn-secondary" onclick="openAddExpenseModal()"><i class="fa-solid fa-arrow-up-long"></i> Chiqim (Xarajat) Kiritish</button>
                </div>
            </div>

            <!-- Financial Metrics Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon success"><i class="fa-solid fa-wallet"></i></div>
                    <div class="stat-info">
                        <span>Jami Kirimlar</span>
                        <h3 style="color: var(--success);">${formatMoney(fin.totalIncome)}</h3>
                        <span class="stat-badge positive"><i class="fa-solid fa-arrow-trend-up"></i> Tushumlar</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon danger"><i class="fa-solid fa-receipt"></i></div>
                    <div class="stat-info">
                        <span>Jami Chiqimlar</span>
                        <h3 style="color: var(--danger);">${formatMoney(fin.totalExpense)}</h3>
                        <span class="stat-badge negative"><i class="fa-solid fa-arrow-trend-down"></i> Xarajatlar</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon primary"><i class="fa-solid fa-scale-balanced"></i></div>
                    <div class="stat-info">
                        <span>Kassa Balansi (Sof Foyda)</span>
                        <h3 style="color: ${fin.netProfit >= 0 ? 'var(--primary)' : 'var(--danger)'};">${formatMoney(fin.netProfit)}</h3>
                        <span class="stat-badge ${fin.netProfit >= 0 ? 'positive' : 'negative'}">Joriy qoldiq</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon warning"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-info">
                        <span>O'quvchilar Soni</span>
                        <h3>${fin.totalStudents} nafar</h3>
                        <span class="stat-badge ${fin.totalDebtorsCount > 0 ? 'negative' : 'positive'}">
                            Qarzdor: ${fin.totalDebtorsCount} ta (${formatMoney(fin.totalDebtAmount)})
                        </span>
                    </div>
                </div>
            </div>

            <!-- Finance Overview Visual & Debtor Summary -->
            <div class="finance-overview-grid">
                <!-- Visual Bar Chart -->
                <div class="dashboard-card" style="margin-bottom: 0;">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3><i class="fa-solid fa-chart-simple" style="color: var(--primary);"></i> Moliyaviy Taqqoslama</h3>
                            <p>Kirim va Chiqimlarning vizual nisbati</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div style="display: flex; gap: 30px; align-items: center; justify-content: space-around; padding: 20px 0;">
                            <div style="text-align: center;">
                                <div style="width: 120px; height: 120px; border-radius: 50%; border: 12px solid var(--success); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 20px; font-weight: 800; color: var(--success);">
                                    ${Math.round((fin.totalIncome / (fin.totalIncome + fin.totalExpense || 1)) * 100)}%
                                </div>
                                <h4 style="color: var(--success);">Jami Kirim</h4>
                                <p style="font-weight: 700; font-size: 15px;">${formatMoney(fin.totalIncome)}</p>
                            </div>

                            <div style="text-align: center;">
                                <div style="width: 120px; height: 120px; border-radius: 50%; border: 12px solid var(--danger); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 20px; font-weight: 800; color: var(--danger);">
                                    ${Math.round((fin.totalExpense / (fin.totalIncome + fin.totalExpense || 1)) * 100)}%
                                </div>
                                <h4 style="color: var(--danger);">Jami Chiqim</h4>
                                <p style="font-weight: 700; font-size: 15px;">${formatMoney(fin.totalExpense)}</p>
                            </div>
                        </div>

                        <div style="background: var(--bg-subtle); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                            <span><strong>Markaz Moliyaviy Holati:</strong> ${fin.netProfit >= 0 ? '<span style="color:var(--success); font-weight:700;"><i class="fa-solid fa-circle-check"></i> Barqaror & Foydali</span>' : '<span style="color:var(--danger); font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Zarar ko\'rmoqda</span>'}</span>
                            <strong>${formatMoney(fin.netProfit)}</strong>
                        </div>
                    </div>
                </div>

                <!-- Debtor Quick List -->
                <div class="dashboard-card" style="margin-bottom: 0;">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3><i class="fa-solid fa-hand-holding-dollar" style="color: var(--danger);"></i> Tezkor Qarzdorlar (${fin.totalDebtorsCount})</h3>
                            <p>To'lov muddati kechikkan o'quvchilar</p>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="navigateToSection('debtors')">Barchasi</button>
                    </div>
                    <div class="card-body">
                        <div class="debtors-summary-list">
                            ${renderDebtorsMiniListHTML(students.filter(s => s.paymentStatus === 'debt' || s.paymentStatus === 'partial').slice(0, 4))}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Full Financial Transactions Table -->
            <div class="dashboard-card" style="margin-top: 28px;">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-list-check" style="color: var(--primary);"></i> Barcha Kirim va Chiqim Tranzaksiyalari (${financeList.length})</h3>
                        <p>O'quv markazdagi har bir to'lov va xarajatning aniq hisoboti</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-success btn-sm" onclick="openAddIncomeModal()"><i class="fa-solid fa-plus"></i> Yangi To'lov</button>
                        <button class="btn btn-danger btn-sm" onclick="openAddExpenseModal()"><i class="fa-solid fa-minus"></i> Yangi Xarajat</button>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderFinanceTableHTML(financeList)}
                </div>
            </div>
        `;
    } else if (state.currentSection === 'debtors') {
        const debtors = students.filter(s => s.paymentStatus === 'debt' || s.paymentStatus === 'partial');
        DOM.contentView.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-hand-holding-dollar" style="color: var(--danger);"></i> O'quv Markaz Qarzdorlar Ro'yxati (${debtors.length})</h3>
                        <p>Jami qarzdorlik summasi: <strong style="color: var(--danger); font-size: 16px;">${formatMoney(fin.totalDebtAmount)}</strong>. Bir bosishda to'lov qabul qiling yoki telefon qiling.</p>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderDebtorsFullTableHTML(debtors)}
                </div>
            </div>
        `;
    } else if (state.currentSection === 'students-stats') {
        DOM.contentView.innerHTML = renderManagerStudentStatsHTML();
    }
}

// Mini Debtors List inside Manager Dashboard
function renderDebtorsMiniListHTML(debtors) {
    if (!debtors.length) {
        return `<div style="text-align: center; color: var(--success); padding: 20px;"><i class="fa-solid fa-circle-check" style="font-size: 24px; margin-bottom: 6px; display: block;"></i>Hozirda hech qanday qarzdor o'quvchi yo'q!</div>`;
    }

    return debtors.map(s => {
        const group = db.getGroupById(s.groupId) || { name: 'Guruh' };
        return `
            <div class="debtor-item">
                <div class="debtor-info">
                    <strong>${s.name}</strong>
                    <span>${group.name} • Tel: ${s.phone}</span>
                </div>
                <div style="text-align: right;">
                    <span class="debtor-amount">-${formatMoney(s.debtAmount)}</span>
                    <button class="btn btn-primary btn-sm" style="margin-top: 4px; padding: 4px 10px; font-size: 11px;" onclick="openAcceptPaymentModal('${s.id}')">
                        To'lash
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Full Financial Transactions Table
function renderFinanceTableHTML(list) {
    if (!list.length) {
        return `<div style="padding: 40px; text-align: center; color: var(--text-muted);">Tranzaksiyalar mavjud emas</div>`;
    }

    const rows = list.map(item => {
        const isIncome = item.type === 'income';
        return `
            <tr>
                <td>
                    <strong><i class="fa-regular fa-calendar" style="color: var(--text-muted);"></i> ${item.date}</strong>
                </td>
                <td>
                    <span class="badge ${isIncome ? 'badge-success' : 'badge-danger'}">
                        <i class="fa-solid ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                        ${isIncome ? 'Kirim' : 'Chiqim'}
                    </span>
                </td>
                <td>
                    <strong>${item.category}</strong>
                </td>
                <td>
                    <strong style="color: ${isIncome ? 'var(--success)' : 'var(--danger)'}; font-size: 15px;">
                        ${isIncome ? '+' : '-'}${formatMoney(item.amount)}
                    </strong>
                </td>
                <td>
                    <span class="badge badge-secondary">${item.paymentMethod || 'Naqd pul'}</span>
                </td>
                <td style="color: var(--text-secondary); font-size: 13px;">
                    ${item.description || '-'}
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Sana</th>
                        <th>Turi</th>
                        <th>Kategoriya</th>
                        <th>Summa</th>
                        <th>To'lov Usuli</th>
                        <th>Izoh / Maqsadi</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Full Debtors Table with Quick Payment and Phone Actions
function renderDebtorsFullTableHTML(debtors) {
    if (!debtors.length) {
        return `<div style="padding: 40px; text-align: center; color: var(--success);"><i class="fa-solid fa-circle-check" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>Ajoyib! Hozirda qarzdor o'quvchilar yo'q.</div>`;
    }

    const rows = debtors.map(s => {
        const group = db.getGroupById(s.groupId) || { name: 'Guruh' };
        const cleanTel = cleanPhone(s.phone);
        const cleanParent = cleanPhone(s.parentPhone);

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-cell-avatar" style="background: linear-gradient(135deg, #ef4444, #f97316);">${s.avatar || 'OQ'}</div>
                        <div class="user-cell-info">
                            <strong>${s.name}</strong>
                            <span>${group.name}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="phone-chip" title="O'quvchi telefoni">
                            <i class="fa-solid fa-phone"></i>
                            <strong>${s.phone}</strong>
                        </span>
                        <a href="tel:${cleanTel}" class="action-icon-btn call" title="Qo'ng'iroq qilish">
                            <i class="fa-solid fa-phone-volume"></i>
                        </a>
                        <a href="https://t.me/${cleanTel}" target="_blank" class="action-icon-btn tg" title="Telegram">
                            <i class="fa-brands fa-telegram"></i>
                        </a>
                    </div>
                    ${s.parentPhone ? `
                        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">
                            Ota-onasi: <a href="tel:${cleanParent}" style="color: var(--text-secondary); text-decoration: underline;">${s.parentPhone}</a>
                        </div>
                    ` : ''}
                </td>
                <td>
                    <strong style="color: var(--danger); font-size: 15px;">-${formatMoney(s.debtAmount)}</strong>
                </td>
                <td>
                    <span class="badge ${s.paymentStatus === 'debt' ? 'badge-danger' : 'badge-warning'}">
                        ${s.paymentStatus === 'debt' ? 'To\'lanmagan' : 'Qisman to\'langan'}
                    </span>
                </td>
                <td style="text-align: right;">
                    <button class="btn btn-success btn-sm" onclick="openAcceptPaymentModal('${s.id}')">
                        <i class="fa-solid fa-hand-holding-dollar"></i> To'lov Qabul Qilish
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="sendSmsReminder('${s.id}')" title="Eslatma xabari yuborish">
                        <i class="fa-solid fa-paper-plane"></i> Eslatma
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>O'quvchi F.I.Sh</th>
                        <th>Telefon Raqamlari</th>
                        <th>Qarzdorlik Summasi</th>
                        <th>Holati</th>
                        <th style="text-align: right;">Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Student Statistics View for Manager
function renderManagerStudentStatsHTML() {
    const students = db.getStudents();
    const groups = db.getGroups();
    const activeCount = students.filter(s => s.status === 'active').length;
    const paidCount = students.filter(s => s.paymentStatus === 'paid').length;
    const debtCount = students.filter(s => s.paymentStatus === 'debt' || s.paymentStatus === 'partial').length;

    const groupRows = groups.map(g => {
        const gStudents = students.filter(s => s.groupId === g.id);
        const gPaid = gStudents.filter(s => s.paymentStatus === 'paid').length;
        const gDebt = gStudents.filter(s => s.paymentStatus === 'debt' || s.paymentStatus === 'partial').length;

        return `
            <tr>
                <td><strong>${g.name}</strong></td>
                <td><span class="badge badge-purple">${g.subject}</span></td>
                <td><strong>${gStudents.length} nafar</strong></td>
                <td><span class="badge badge-success">${gPaid} ta to'lagan</span></td>
                <td><span class="badge badge-danger">${gDebt} ta qarzdor</span></td>
                <td><strong>${formatMoney(gStudents.length * g.price)}</strong></td>
            </tr>
        `;
    }).join('');

    return `
        <div class="dashboard-card">
            <div class="card-header">
                <div class="card-title-group">
                    <h3><i class="fa-solid fa-users" style="color: var(--primary);"></i> O'quvchilar Soni va Guruhlar Statistikasi</h3>
                    <p>O'quv markazda nechta o'quvchi o'qishi, guruhlar kesimidagi tahlili</p>
                </div>
            </div>
            <div class="card-body">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon primary"><i class="fa-solid fa-user-graduate"></i></div>
                        <div class="stat-info">
                            <span>Jami O'quvchilar</span>
                            <h3>${students.length} nafar</h3>
                            <span class="stat-badge positive">Barcha ro'yxatdagilar</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon success"><i class="fa-solid fa-user-check"></i></div>
                        <div class="stat-info">
                            <span>To'lov Qilganlar</span>
                            <h3>${paidCount} nafar</h3>
                            <span class="stat-badge positive">${Math.round((paidCount/students.length)*100)}% to'liq to'lagan</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon danger"><i class="fa-solid fa-user-xmark"></i></div>
                        <div class="stat-info">
                            <span>Qarzdorlar</span>
                            <h3>${debtCount} nafar</h3>
                            <span class="stat-badge negative">${Math.round((debtCount/students.length)*100)}% qarzdor</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple"><i class="fa-solid fa-layer-group"></i></div>
                        <div class="stat-info">
                            <span>Guruhlar Soni</span>
                            <h3>${groups.length} ta</h3>
                            <span class="stat-badge neutral">O'rtacha 1 guruhda: ${(students.length / groups.length).toFixed(1)} o'quvchi</span>
                        </div>
                    </div>
                </div>

                <h4 style="margin: 24px 0 12px; font-size: 16px;">Guruhlar Kesimida O'quvchilar Soni va Oylik Kutilayotgan Tushum:</h4>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Guruh Nomi</th>
                                <th>Fani</th>
                                <th>O'quvchilar Soni</th>
                                <th>To'laganlar</th>
                                <th>Qarzdorlar</th>
                                <th>Oylik Potensial Tushum</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

/* ==========================================================
   O'QITUVCHI (TEACHER) PANEL VIEWS
   Attendance Taking, My Groups, My Students
   ========================================================== */
function renderTeacherView() {
    const teachers = db.getTeachers();
    const currentTeacher = db.getTeacherById(state.selectedTeacherId) || teachers[0];
    const myGroups = db.getGroups().filter(g => g.teacherId === currentTeacher.id);
    const students = db.getStudents();

    if (state.currentSection === 'dashboard') {
        DOM.contentView.innerHTML = `
            <!-- Teacher Selector Top Bar -->
            <div style="background: var(--bg-surface); padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fa-solid fa-chalkboard-user" style="font-size: 22px; color: var(--primary);"></i>
                    <div>
                        <strong style="font-size: 15px;">O'qituvchini tanlang (Demo uchun):</strong>
                        <p style="font-size: 12px; color: var(--text-muted); margin: 0;">Turli o'qituvchilar nomidan tizimga kirib ko'rishingiz mumkin</p>
                    </div>
                </div>
                <select class="form-select" id="teacherSwitcherSelect" style="min-width: 240px; font-weight: 600;">
                    ${teachers.map(t => `<option value="${t.id}" ${t.id === currentTeacher.id ? 'selected' : ''}>${t.name} (${t.subject})</option>`).join('')}
                </select>
            </div>

            <!-- Role Welcome Banner -->
            <div class="role-banner" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);">
                <div class="role-banner-content">
                    <h2>Assalomu alaykum, ${currentTeacher.name}!</h2>
                    <p>Faningiz: <strong>${currentTeacher.subject}</strong>. Bugungi darslaringiz uchun tezkor davomat oling. Siz kiritgan davomat avtomatik ravishda Bosh Admin panelida ko'rinadi.</p>
                </div>
                <div class="role-banner-actions">
                    <button class="btn btn-primary" onclick="navigateToSection('take-attendance')">
                        <i class="fa-solid fa-clipboard-user"></i> Bugungi Davomatni Olish
                    </button>
                </div>
            </div>

            <!-- Teacher My Groups Cards -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-users-rectangle" style="color: var(--primary);"></i> Mening Guruhlarim (${myGroups.length} ta)</h3>
                        <p>Sizga biriktirilgan faol dars guruhlari va dars jadvali</p>
                    </div>
                </div>
                <div class="card-body">
                    <div class="stats-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
                        ${myGroups.map(g => {
                            const gStudents = students.filter(s => s.groupId === g.id);
                            return `
                                <div class="stat-card" style="display: flex; flex-direction: column; align-items: flex-start;">
                                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px;">
                                        <span class="badge badge-purple">${g.subject}</span>
                                        <span class="badge badge-success"><i class="fa-solid fa-user-graduate"></i> ${gStudents.length} o'quvchi</span>
                                    </div>
                                    <h3 style="font-size: 18px; margin-bottom: 6px;">${g.name}</h3>
                                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                                        <div><i class="fa-regular fa-calendar-days" style="color: var(--primary); width: 20px;"></i> ${g.days}</div>
                                        <div><i class="fa-regular fa-clock" style="color: var(--primary); width: 20px;"></i> ${g.time} (${g.room})</div>
                                    </div>
                                    <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="openTakeAttendanceForGroup('${g.id}')">
                                        <i class="fa-solid fa-calendar-check"></i> Shu Guruhga Davomat Olish
                                    </button>
                                </div>
                            `;
                        }).join('') || '<div style="color: var(--text-muted); padding: 20px;">Bu o\'qituvchiga hozircha guruh biriktirilmagan</div>'}
                    </div>
                </div>
            </div>
        `;

        // Attach teacher selector switch
        const sel = document.getElementById('teacherSwitcherSelect');
        if (sel) {
            sel.addEventListener('change', (e) => {
                state.selectedTeacherId = e.target.value;
                renderView();
            });
        }
    } else if (state.currentSection === 'take-attendance') {
        DOM.contentView.innerHTML = renderTeacherTakeAttendanceHTML(currentTeacher, myGroups);
        attachTakeAttendanceEvents();
    } else if (state.currentSection === 'my-students') {
        const groupIds = myGroups.map(g => g.id);
        const myStudents = students.filter(s => groupIds.includes(s.groupId));
        DOM.contentView.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title-group">
                        <h3><i class="fa-solid fa-address-book" style="color: var(--primary);"></i> Mening O'quvchilarim Ro'yxati (${myStudents.length})</h3>
                        <p>O'quvchilarning telefon raqamlari va ota-onalarining kontaktlari</p>
                    </div>
                </div>
                <div class="card-body" style="padding: 0;">
                    ${renderStudentsTableHTML(myStudents, false)}
                </div>
            </div>
        `;
    }
}

// Teacher Attendance Taking UI
function renderTeacherTakeAttendanceHTML(currentTeacher, myGroups) {
    if (!myGroups.length) {
        return `<div class="dashboard-card"><div class="card-body" style="text-align: center; color: var(--text-muted); padding: 40px;">Sizga hech qanday guruh biriktirilmagan.</div></div>`;
    }

    // Default to first group if not set or invalid
    if (!myGroups.some(g => g.id === state.selectedAttendanceGroup)) {
        state.selectedAttendanceGroup = myGroups[0].id;
    }

    const currentGroup = db.getGroupById(state.selectedAttendanceGroup) || myGroups[0];
    const groupStudents = db.getStudents().filter(s => s.groupId === currentGroup.id);

    // Check if attendance already exists for this date and group
    const existingAttendance = db.getAttendanceForGroupAndDate(currentGroup.id, state.selectedAttendanceDate);
    const existingRecords = existingAttendance ? existingAttendance.records : {};
    const existingNotes = existingAttendance ? existingAttendance.notes : '';

    const studentRows = groupStudents.map(s => {
        const cleanTel = cleanPhone(s.phone);
        const curStatus = existingRecords[s.id] || 'present'; // default to present

        return `
            <tr data-student-id="${s.id}">
                <td>
                    <div class="user-cell">
                        <div class="user-cell-avatar">${s.avatar || 'OQ'}</div>
                        <div class="user-cell-info">
                            <strong>${s.name}</strong>
                            <span>Tel: ${s.phone}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="phone-chip">
                        <i class="fa-solid fa-phone"></i>
                        ${s.phone}
                    </span>
                    <a href="tel:${cleanTel}" class="action-icon-btn call" title="Qo'ng'iroq qilish">
                        <i class="fa-solid fa-phone-volume"></i>
                    </a>
                </td>
                <td>
                    <!-- Interactive Attendance Pills -->
                    <div class="attendance-pill-group" data-for-student="${s.id}">
                        <button type="button" class="att-btn present ${curStatus === 'present' ? 'active' : ''}" data-val="present">
                            <i class="fa-solid fa-check"></i> Keldi
                        </button>
                        <button type="button" class="att-btn absent ${curStatus === 'absent' ? 'active' : ''}" data-val="absent">
                            <i class="fa-solid fa-xmark"></i> Kelmadi
                        </button>
                        <button type="button" class="att-btn excused ${curStatus === 'excused' ? 'active' : ''}" data-val="excused">
                            <i class="fa-solid fa-clock"></i> Sababli
                        </button>
                        <button type="button" class="att-btn late ${curStatus === 'late' ? 'active' : ''}" data-val="late">
                            <i class="fa-solid fa-hourglass-half"></i> Kechikdi
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="dashboard-card">
            <div class="card-header">
                <div class="card-title-group">
                    <h3><i class="fa-solid fa-clipboard-user" style="color: var(--primary);"></i> Kunlik Davomat Olish</h3>
                    <p>Belgilangan davomat natijalari darhol saqlanadi va Bosh Admin monitoringida to'liq ko'rinadi</p>
                </div>
            </div>
            <div class="card-body">
                <!-- Group & Date Selector -->
                <div class="attendance-filters-bar" style="margin-bottom: 24px;">
                    <div class="filter-group">
                        <label><i class="fa-solid fa-users"></i> Guruhni tanlang:</label>
                        <select class="form-select" id="attTakeGroupSelect">
                            ${myGroups.map(g => `<option value="${g.id}" ${g.id === currentGroup.id ? 'selected' : ''}>${g.name} (${g.subject})</option>`).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label><i class="fa-regular fa-calendar"></i> Dars Sanasi:</label>
                        <input type="date" class="form-input" id="attTakeDateInput" value="${state.selectedAttendanceDate}">
                    </div>

                    <div class="filter-group">
                        <button class="btn btn-secondary btn-sm" id="btnMarkAllPresent">
                            <i class="fa-solid fa-check-double"></i> Hammani "Keldi" qilish
                        </button>
                    </div>
                </div>

                <!-- Students Attendance Table -->
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>O'quvchi F.I.Sh</th>
                                <th>Telefon Raqami</th>
                                <th>Davomat Belgilash</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentRows || '<tr><td colspan="3" style="text-align:center; padding: 30px; color: var(--text-muted);">Bu guruhda hali o\'quvchi yo\'q</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <!-- Lesson Notes / Topic -->
                <div class="form-group" style="margin-top: 24px;">
                    <label>Bugungi dars mavzusi yoki o'qituvchi izohi:</label>
                    <textarea id="attLessonNotes" class="form-input" rows="2" placeholder="Masalan: Present Perfect zamoni mavzusi va uy vazifasi tahlili...">${existingNotes}</textarea>
                </div>

                <div class="form-actions" style="margin-top: 20px;">
                    <button class="btn btn-primary btn-lg" id="btnSaveAttendance">
                        <i class="fa-solid fa-floppy-disk"></i> Davomatni Saqlash & Admin Panelga Yuborish
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachTakeAttendanceEvents() {
    const groupSelect = document.getElementById('attTakeGroupSelect');
    const dateInput = document.getElementById('attTakeDateInput');
    const markAllBtn = document.getElementById('btnMarkAllPresent');
    const saveBtn = document.getElementById('btnSaveAttendance');

    if (groupSelect) {
        groupSelect.addEventListener('change', (e) => {
            state.selectedAttendanceGroup = e.target.value;
            renderView();
        });
    }

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            state.selectedAttendanceDate = e.target.value;
            renderView();
        });
    }

    // Toggle attendance pills
    document.querySelectorAll('.attendance-pill-group').forEach(group => {
        group.addEventListener('click', (e) => {
            const btn = e.target.closest('.att-btn');
            if (!btn) return;
            group.querySelectorAll('.att-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mark all present
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.attendance-pill-group').forEach(group => {
                group.querySelectorAll('.att-btn').forEach(b => b.classList.remove('active'));
                const presentBtn = group.querySelector('.att-btn.present');
                if (presentBtn) presentBtn.classList.add('active');
            });
            showToast("Barcha o'quvchilarga 'Keldi' holati belgilandi", "info");
        });
    }

    // Save attendance
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const records = {};
            document.querySelectorAll('.attendance-pill-group').forEach(group => {
                const studentId = group.getAttribute('data-for-student');
                const activeBtn = group.querySelector('.att-btn.active');
                if (studentId && activeBtn) {
                    records[studentId] = activeBtn.getAttribute('data-val');
                }
            });

            const notes = document.getElementById('attLessonNotes').value;
            const currentTeacher = db.getTeacherById(state.selectedTeacherId) || db.getTeachers()[0];

            db.saveAttendanceRecord(
                state.selectedAttendanceGroup,
                state.selectedAttendanceDate,
                currentTeacher.id,
                records,
                notes
            );

            showToast("Davomat muvaffaqiyatli saqlandi va Admin panelda aks etdi!", "success");
        });
    }
}

function openTakeAttendanceForGroup(groupId) {
    state.selectedAttendanceGroup = groupId;
    navigateToSection('take-attendance');
}

/* ==========================================================
   NAVIGATION HELPER
   ========================================================== */
function navigateToSection(section) {
    state.currentSection = section;
    renderSidebarNav();
    renderView();
}

function filterList(list, keys) {
    if (!state.searchQuery) return list;
    return list.filter(item => {
        return keys.some(key => {
            const val = String(item[key] || '').toLowerCase();
            return val.includes(state.searchQuery);
        });
    });
}

/* ==========================================================
   MODALS SYSTEM
   ========================================================== */
function openModal(title, bodyHtml) {
    DOM.modalTitle.textContent = title;
    DOM.modalBody.innerHTML = bodyHtml;
    DOM.modalOverlay.classList.add('active');
}

function closeModal() {
    DOM.modalOverlay.classList.remove('active');
}

// Student Modal (Add & Edit)
function openAddStudentModal(preselectedGroupId = '') {
    const groups = db.getGroups();
    const html = `
        <form id="addStudentForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>O'quvchi F.I.Sh *</label>
                    <input type="text" id="m_studentName" class="form-input" placeholder="Masalan: Sardorbek Eshmatov" required>
                </div>

                <div class="form-group">
                    <label>O'quvchining O'zining Telefoni *</label>
                    <input type="tel" id="m_studentPhone" class="form-input" placeholder="+998 90 123-45-67" required>
                </div>

                <div class="form-group">
                    <label>Ota-onasining Telefoni</label>
                    <input type="tel" id="m_parentPhone" class="form-input" placeholder="+998 91 987-65-43">
                </div>

                <div class="form-group full">
                    <label>Qaysi Guruhga Biriktirilsin? *</label>
                    <select id="m_studentGroup" class="form-select" required>
                        <option value="">Guruhni tanlang...</option>
                        ${groups.map(g => `<option value="${g.id}" ${g.id === preselectedGroupId ? 'selected' : ''}>${g.name} (${g.subject}) - ${formatMoney(g.price)}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>To'lov Holati</label>
                    <select id="m_paymentStatus" class="form-select">
                        <option value="paid">To'langan (Qarz yo'q)</option>
                        <option value="debt">Qarzdor (To'lanmagan)</option>
                        <option value="partial">Qisman to'langan</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Qarz Summasi (so'm)</label>
                    <input type="number" id="m_debtAmount" class="form-input" value="0" step="10000">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-user-plus"></i> O'quvchini Saqlash</button>
            </div>
        </form>
    `;

    openModal("Yangi O'quvchi Qo'shish", html);

    document.getElementById('addStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newStudent = {
            name: document.getElementById('m_studentName').value.trim(),
            phone: document.getElementById('m_studentPhone').value.trim(),
            parentPhone: document.getElementById('m_parentPhone').value.trim(),
            groupId: document.getElementById('m_studentGroup').value,
            paymentStatus: document.getElementById('m_paymentStatus').value,
            debtAmount: Number(document.getElementById('m_debtAmount').value) || 0
        };

        db.addStudent(newStudent);
        closeModal();
        updateMiniStats();
        renderView();
        showToast("Yangi o'quvchi muvaffaqiyatli ro'yxatga qo'shildi!");
    });
}

function openEditStudentModal(studentId) {
    const student = db.getStudentById(studentId);
    if (!student) return;
    const groups = db.getGroups();

    const html = `
        <form id="editStudentForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>O'quvchi F.I.Sh *</label>
                    <input type="text" id="m_editStudentName" class="form-input" value="${student.name}" required>
                </div>

                <div class="form-group">
                    <label>O'quvchining O'zining Telefoni *</label>
                    <input type="tel" id="m_editStudentPhone" class="form-input" value="${student.phone}" required>
                </div>

                <div class="form-group">
                    <label>Ota-onasining Telefoni</label>
                    <input type="tel" id="m_editParentPhone" class="form-input" value="${student.parentPhone || ''}">
                </div>

                <div class="form-group full">
                    <label>Guruhi *</label>
                    <select id="m_editStudentGroup" class="form-select" required>
                        ${groups.map(g => `<option value="${g.id}" ${g.id === student.groupId ? 'selected' : ''}>${g.name} (${g.subject})</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>To'lov Holati</label>
                    <select id="m_editPaymentStatus" class="form-select">
                        <option value="paid" ${student.paymentStatus === 'paid' ? 'selected' : ''}>To'langan</option>
                        <option value="debt" ${student.paymentStatus === 'debt' ? 'selected' : ''}>Qarzdor</option>
                        <option value="partial" ${student.paymentStatus === 'partial' ? 'selected' : ''}>Qisman to'langan</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Qarz Summasi (so'm)</label>
                    <input type="number" id="m_editDebtAmount" class="form-input" value="${student.debtAmount || 0}" step="10000">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> O'zgarishlarni Saqlash</button>
            </div>
        </form>
    `;

    openModal("O'quvchi Ma'lumotlarini Tahrirlash", html);

    document.getElementById('editStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.updateStudent(studentId, {
            name: document.getElementById('m_editStudentName').value.trim(),
            phone: document.getElementById('m_editStudentPhone').value.trim(),
            parentPhone: document.getElementById('m_editParentPhone').value.trim(),
            groupId: document.getElementById('m_editStudentGroup').value,
            paymentStatus: document.getElementById('m_editPaymentStatus').value,
            debtAmount: Number(document.getElementById('m_editDebtAmount').value) || 0
        });

        closeModal();
        renderView();
        showToast("O'quvchi ma'lumotlari yangilandi!");
    });
}

function deleteStudent(studentId) {
    const s = db.getStudentById(studentId);
    if (!s) return;
    if (confirm(`${s.name}ni tizimdan o'chirishni xohlaysizmi?`)) {
        db.deleteStudent(studentId);
        updateMiniStats();
        renderView();
        showToast("O'quvchi tizimdan o'chirildi", "error");
    }
}

// Teacher Modal (Add & Edit)
function openAddTeacherModal() {
    const html = `
        <form id="addTeacherForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>O'qituvchi F.I.Sh *</label>
                    <input type="text" id="m_teacherName" class="form-input" placeholder="Masalan: Jamshidbek Rahimov" required>
                </div>

                <div class="form-group">
                    <label>Telefon Raqami *</label>
                    <input type="tel" id="m_teacherPhone" class="form-input" placeholder="+998 90 123-45-67" required>
                </div>

                <div class="form-group">
                    <label>O'tadigan Fani / Mutaxassisligi *</label>
                    <input type="text" id="m_teacherSubject" class="form-input" placeholder="Masalan: IELTS & Ingliz tili" required>
                </div>

                <div class="form-group">
                    <label>Oylik Maoshi (so'm)</label>
                    <input type="number" id="m_teacherSalary" class="form-input" value="5000000" step="100000">
                </div>

                <div class="form-group">
                    <label>Ish Tajribasi</label>
                    <input type="text" id="m_teacherExperience" class="form-input" placeholder="Masalan: 4 yil">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-user-tie"></i> O'qituvchini Saqlash</button>
            </div>
        </form>
    `;

    openModal("Yangi O'qituvchi Qo'shish", html);

    document.getElementById('addTeacherForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newTeacher = {
            name: document.getElementById('m_teacherName').value.trim(),
            phone: document.getElementById('m_teacherPhone').value.trim(),
            subject: document.getElementById('m_teacherSubject').value.trim(),
            salary: Number(document.getElementById('m_teacherSalary').value) || 0,
            experience: document.getElementById('m_teacherExperience').value.trim()
        };

        db.addTeacher(newTeacher);
        closeModal();
        renderView();
        showToast("Yangi o'qituvchi muvaffaqiyatli qo'shildi!");
    });
}

function openEditTeacherModal(teacherId) {
    const teacher = db.getTeacherById(teacherId);
    if (!teacher) return;

    const html = `
        <form id="editTeacherForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>O'qituvchi F.I.Sh *</label>
                    <input type="text" id="m_editTeacherName" class="form-input" value="${teacher.name}" required>
                </div>

                <div class="form-group">
                    <label>Telefon Raqami *</label>
                    <input type="tel" id="m_editTeacherPhone" class="form-input" value="${teacher.phone}" required>
                </div>

                <div class="form-group">
                    <label>Mutaxassisligi *</label>
                    <input type="text" id="m_editTeacherSubject" class="form-input" value="${teacher.subject}" required>
                </div>

                <div class="form-group">
                    <label>Oylik Maoshi (so'm)</label>
                    <input type="number" id="m_editTeacherSalary" class="form-input" value="${teacher.salary || 0}" step="100000">
                </div>

                <div class="form-group">
                    <label>Ish Tajribasi</label>
                    <input type="text" id="m_editTeacherExperience" class="form-input" value="${teacher.experience || ''}">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> O'zgarishlarni Saqlash</button>
            </div>
        </form>
    `;

    openModal("O'qituvchini Tahrirlash", html);

    document.getElementById('editTeacherForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.updateTeacher(teacherId, {
            name: document.getElementById('m_editTeacherName').value.trim(),
            phone: document.getElementById('m_editTeacherPhone').value.trim(),
            subject: document.getElementById('m_editTeacherSubject').value.trim(),
            salary: Number(document.getElementById('m_editTeacherSalary').value) || 0,
            experience: document.getElementById('m_editTeacherExperience').value.trim()
        });

        closeModal();
        renderView();
        showToast("O'qituvchi ma'lumotlari yangilandi!");
    });
}

function deleteTeacher(teacherId) {
    const t = db.getTeacherById(teacherId);
    if (!t) return;
    if (confirm(`${t.name}ni tizimdan o'chirishni tasdiqlaysizmi?`)) {
        db.deleteTeacher(teacherId);
        renderView();
        showToast("O'qituvchi tizimdan o'chirildi", "error");
    }
}

// Group Modal
function openAddGroupModal() {
    const teachers = db.getTeachers();
    const html = `
        <form id="addGroupForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>Guruh Nomi *</label>
                    <input type="text" id="m_groupName" class="form-input" placeholder="Masalan: IELTS Band 7.5 Intensive" required>
                </div>

                <div class="form-group">
                    <label>Fani *</label>
                    <input type="text" id="m_groupSubject" class="form-input" placeholder="Masalan: Ingliz tili" required>
                </div>

                <div class="form-group">
                    <label>O'qituvchi *</label>
                    <select id="m_groupTeacher" class="form-select" required>
                        <option value="">O'qituvchini tanlang...</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Dars Kunlari</label>
                    <input type="text" id="m_groupDays" class="form-input" placeholder="Dushanba - Chorshanba - Juma">
                </div>

                <div class="form-group">
                    <label>Dars Vaqti & Xona</label>
                    <input type="text" id="m_groupTime" class="form-input" placeholder="16:00 - 18:00 (102-xona)">
                </div>

                <div class="form-group full">
                    <label>Oylik Kurs Narxi (so'm)</label>
                    <input type="number" id="m_groupPrice" class="form-input" value="450000" step="10000" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Guruhni Ochish</button>
            </div>
        </form>
    `;

    openModal("Yangi Guruh Ochish", html);

    document.getElementById('addGroupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.addGroup({
            name: document.getElementById('m_groupName').value.trim(),
            subject: document.getElementById('m_groupSubject').value.trim(),
            teacherId: document.getElementById('m_groupTeacher').value,
            days: document.getElementById('m_groupDays').value.trim(),
            time: document.getElementById('m_groupTime').value.trim(),
            price: Number(document.getElementById('m_groupPrice').value) || 0
        });

        closeModal();
        updateMiniStats();
        renderView();
        showToast("Yangi guruh muvaffaqiyatli ochildi!");
    });
}

// Income Modal (To'lov qabul qilish)
function openAddIncomeModal() {
    const students = db.getStudents();
    const html = `
        <form id="addIncomeForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>O'quvchini Tanlang (Agar o'quvchi to'lovi bo'lsa)</label>
                    <select id="m_incomeStudent" class="form-select">
                        <option value="">Umumiy boshqa tushum (Kitob, test va h.k.)</option>
                        ${students.map(s => `<option value="${s.id}">${s.name} (${s.phone}) - Qarz: ${formatMoney(s.debtAmount)}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>To'lov Kategoriyasi *</label>
                    <select id="m_incomeCategory" class="form-select" required>
                        <option value="Oylik to'lov">Oylik to'lov</option>
                        <option value="Kitob va qo'llanmalar">Kitob va qo'llanmalar</option>
                        <option value="Imtihon / Mock Test">Imtihon / Mock Test</option>
                        <option value="Boshqa tushum">Boshqa tushum</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Summa (so'm) *</label>
                    <input type="number" id="m_incomeAmount" class="form-input" placeholder="Masalan: 480000" step="10000" required>
                </div>

                <div class="form-group">
                    <label>To'lov Usuli *</label>
                    <select id="m_incomeMethod" class="form-select">
                        <option value="Payme / Click">Payme / Click</option>
                        <option value="Naqd pul">Naqd pul</option>
                        <option value="Karta orqali">Bank kartasi orqali</option>
                        <option value="Bank o'tkazmasi">Bank o'tkazmasi (Hisob raqam)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Sana</label>
                    <input type="date" id="m_incomeDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <div class="form-group full">
                    <label>Qo'shimcha Izoh</label>
                    <input type="text" id="m_incomeDesc" class="form-input" placeholder="Izoh yoki chek raqami">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success"><i class="fa-solid fa-arrow-down"></i> To'lovni Qabul Qilish</button>
            </div>
        </form>
    `;

    openModal("Kirim (To'lov) Qabul Qilish", html);

    document.getElementById('addIncomeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = document.getElementById('m_incomeStudent').value || null;
        const student = studentId ? db.getStudentById(studentId) : null;
        const amount = Number(document.getElementById('m_incomeAmount').value);
        const category = document.getElementById('m_incomeCategory').value;
        const desc = document.getElementById('m_incomeDesc').value || (student ? `${student.name} to'lovi` : category);

        db.addFinanceRecord({
            type: 'income',
            studentId,
            category,
            amount,
            paymentMethod: document.getElementById('m_incomeMethod').value,
            date: document.getElementById('m_incomeDate').value,
            description: desc
        });

        closeModal();
        renderView();
        showToast("To'lov muvaffaqiyatli qabul qilindi va kassa balansiga qo'shildi!");
    });
}

function openAcceptPaymentModal(studentId) {
    const student = db.getStudentById(studentId);
    if (!student) return;

    const html = `
        <form id="quickPaymentForm">
            <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px;">
                <h4 style="margin-bottom: 4px;">${student.name}</h4>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    <span>Telefon: <strong>${student.phone}</strong></span> • 
                    <span>Qarz: <strong style="color: var(--danger);">${formatMoney(student.debtAmount)}</strong></span>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group full">
                    <label>To'lanayotgan Summa (so'm) *</label>
                    <input type="number" id="m_qpAmount" class="form-input" value="${student.debtAmount || 450000}" step="10000" required>
                </div>

                <div class="form-group">
                    <label>To'lov Usuli</label>
                    <select id="m_qpMethod" class="form-select">
                        <option value="Payme / Click">Payme / Click</option>
                        <option value="Naqd pul">Naqd pul</option>
                        <option value="Karta orqali">Bank kartasi</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Sana</label>
                    <input type="date" id="m_qpDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success"><i class="fa-solid fa-check"></i> To'lovni Tasdiqlash</button>
            </div>
        </form>
    `;

    openModal("Qarz To'lovini Qabul Qilish", html);

    document.getElementById('quickPaymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = Number(document.getElementById('m_qpAmount').value);

        db.addFinanceRecord({
            type: 'income',
            studentId: student.id,
            category: "Oylik to'lov",
            amount,
            paymentMethod: document.getElementById('m_qpMethod').value,
            date: document.getElementById('m_qpDate').value,
            description: `${student.name} - to'lov qabul qilindi`
        });

        closeModal();
        renderView();
        showToast(`${student.name} uchun to'lov muvaffaqiyatli qabul qilindi!`);
    });
}

// Expense Modal (Chiqim kiritish)
function openAddExpenseModal() {
    const html = `
        <form id="addExpenseForm">
            <div class="form-grid">
                <div class="form-group full">
                    <label>Chiqim Kategoriyasi *</label>
                    <select id="m_expenseCategory" class="form-select" required>
                        <option value="O'qituvchilar oyligi">O'qituvchilar oylik maoshi</option>
                        <option value="O'quv binosi ijarasi (Arenda)">O'quv binosi ijarasi (Arenda)</option>
                        <option value="Kommunal va Internet">Kommunal to'lovlar & Internet</option>
                        <option value="Reklama & Target (SMM)">Reklama va Marketing (Target / SMM)</option>
                        <option value="Kantselyariya va jihozlar">Kantselyariya, qog'oz va printer</option>
                        <option value="Boshqa xarajat">Boshqa ma'muriy xarajat</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Chiqim Summasi (so'm) *</label>
                    <input type="number" id="m_expenseAmount" class="form-input" placeholder="Masalan: 1200000" step="10000" required>
                </div>

                <div class="form-group">
                    <label>To'lov Usuli</label>
                    <select id="m_expenseMethod" class="form-select">
                        <option value="Bank orqali">Bank hisobidan o'tkazma</option>
                        <option value="Naqd pul">Kassadan naqd pul</option>
                        <option value="Karta orqali">Korporativ karta</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Sana</label>
                    <input type="date" id="m_expenseDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>

                <div class="form-group full">
                    <label>Xarajat Maqsadi / Izoh *</label>
                    <input type="text" id="m_expenseDesc" class="form-input" placeholder="Xarajat sababi yoki to'lov maqsadi" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-danger"><i class="fa-solid fa-arrow-up"></i> Chiqimni Kiritish</button>
            </div>
        </form>
    `;

    openModal("Yangi Chiqim (Xarajat) Kiritish", html);

    document.getElementById('addExpenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        db.addFinanceRecord({
            type: 'expense',
            category: document.getElementById('m_expenseCategory').value,
            amount: Number(document.getElementById('m_expenseAmount').value),
            paymentMethod: document.getElementById('m_expenseMethod').value,
            date: document.getElementById('m_expenseDate').value,
            description: document.getElementById('m_expenseDesc').value.trim()
        });

        closeModal();
        renderView();
        showToast("Xarajat kiritildi va kassa balansidan ayirildi!", "info");
    });
}

// Attendance Details Modal for Admin
function viewAttendanceDetailsModal(attendanceId) {
    const att = db.getAttendance().find(a => a.id === attendanceId);
    if (!att) return;
    const group = db.getGroupById(att.groupId) || { name: 'Guruh' };
    const teacher = db.getTeacherById(att.teacherId) || { name: 'O\'qituvchi' };
    const records = att.records || {};

    const studentRows = Object.keys(records).map(studentId => {
        const student = db.getStudentById(studentId) || { name: 'O\'quvchi', phone: '-' };
        const status = records[studentId];
        let statusBadge = '';
        if (status === 'present') statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Kelgan</span>';
        else if (status === 'absent') statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Kelmagan</span>';
        else if (status === 'excused') statusBadge = '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Sababli</span>';
        else statusBadge = '<span class="badge badge-purple"><i class="fa-solid fa-hourglass-half"></i> Kechikkan</span>';

        return `
            <tr>
                <td><strong>${student.name}</strong></td>
                <td><span class="phone-chip"><i class="fa-solid fa-phone"></i> ${student.phone}</span></td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');

    const html = `
        <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span><strong>Guruh:</strong> ${group.name}</span>
                <span><strong>Sana:</strong> ${att.date}</span>
            </div>
            <div><strong>Davomat qilgan o'qituvchi:</strong> ${teacher.name}</div>
            ${att.notes ? `<div style="margin-top: 8px; font-size: 13px; color: var(--text-secondary); background: var(--bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm);"><strong>Mavzu/Izoh:</strong> ${att.notes}</div>` : ''}
        </div>

        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>O'quvchi F.I.Sh</th>
                        <th>Telefon Raqami</th>
                        <th>Davomat Natijasi</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentRows || '<tr><td colspan="3">Ma\'lumot yo\'q</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="form-actions" style="margin-top: 16px;">
            <button class="btn btn-secondary" onclick="closeModal()">Yopish</button>
        </div>
    `;

    openModal(`Davomat Tafsiloti (${group.name} - ${att.date})`, html);
}

// SMS / Telegram Reminder
function sendSmsReminder(studentId) {
    const student = db.getStudentById(studentId);
    if (!student) return;
    const cleanTel = cleanPhone(student.phone);
    const message = `Hurmatli ${student.name}, Renesans O'quv Markazidan eslatma: joriy oy uchun ${formatMoney(student.debtAmount)} qarzdorligingiz mavjud. Iltimos to'lovni o'z vaqtida amalga oshirishingizni so'raymiz.`;

    const html = `
        <div style="margin-bottom: 16px;">
            <p>Quyidagi eslatma xabarini o'quvchiga yoki ota-onasiga yuborishingiz mumkin:</p>
            <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); font-size: 13.5px; border: 1px solid var(--border-color); margin: 12px 0;">
                ${message}
            </div>
            <p style="font-size: 12.5px; color: var(--text-muted);">Telefon: <strong>${student.phone}</strong></p>
        </div>

        <div class="form-actions">
            <button class="btn btn-secondary" onclick="closeModal()">Bekor qilish</button>
            <a href="https://t.me/${cleanTel}" target="_blank" class="btn btn-primary" onclick="closeModal(); showToast('Telegram ochilmoqda...');">
                <i class="fa-brands fa-telegram"></i> Telegram orqali yuborish
            </a>
            <a href="sms:${cleanTel}?body=${encodeURIComponent(message)}" class="btn btn-success" onclick="closeModal(); showToast('SMS yuborish dasturi ochildi');">
                <i class="fa-solid fa-message"></i> SMS yuborish
            </a>
        </div>
    `;

    openModal(`To'lov Eslatmasi Yuborish`, html);
}
