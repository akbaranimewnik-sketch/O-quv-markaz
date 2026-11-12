/* ==========================================================
   RENESANS O'QUV MARKAZI - DATABASE & LOCALSTORAGE ENGINE
   ========================================================== */

const STORAGE_KEYS = {
    STUDENTS: 'renesans_students_v1',
    TEACHERS: 'renesans_teachers_v1',
    GROUPS: 'renesans_groups_v1',
    ATTENDANCE: 'renesans_attendance_v1',
    FINANCE: 'renesans_finance_v1',
    ACTIVE_ROLE: 'renesans_active_role_v1',
    THEME: 'renesans_theme_v1'
};

// Initial realistic seed dataset
const INITIAL_DATA = {
    teachers: [
        {
            id: 't-1',
            name: 'Jamshid Rahimov',
            phone: '+998 90 123-45-67',
            subject: 'Ingliz tili (IELTS 8.0)',
            salary: 5500000,
            experience: '5 yil',
            status: 'active',
            avatar: 'JR'
        },
        {
            id: 't-2',
            name: 'Nodira Xalimova',
            phone: '+998 93 456-78-90',
            subject: 'Oliy Matematika',
            salary: 5000000,
            experience: '7 yil',
            status: 'active',
            avatar: 'NX'
        },
        {
            id: 't-3',
            name: 'Sardorbek Aliyev',
            phone: '+998 97 789-01-23',
            subject: 'IT & Frontend Dasturlash',
            salary: 6500000,
            experience: '4 yil',
            status: 'active',
            avatar: 'SA'
        },
        {
            id: 't-4',
            name: 'Zilola Umarova',
            phone: '+998 99 876-54-32',
            subject: 'Rus tili (Grammatika & So\'zlashuv)',
            salary: 4000000,
            experience: '3 yil',
            status: 'active',
            avatar: 'ZU'
        }
    ],

    groups: [
        {
            id: 'g-1',
            name: 'IELTS Band 7.0 Master',
            subject: 'Ingliz tili',
            teacherId: 't-1',
            days: 'Dushanba - Chorshanba - Juma',
            time: '18:00 - 19:30',
            room: '102-xona',
            price: 480000
        },
        {
            id: 'g-2',
            name: 'Matematika Prezident Maktabi',
            subject: 'Matematika',
            teacherId: 't-2',
            days: 'Seshanba - Payshanba - Shanba',
            time: '14:00 - 15:30',
            room: '201-xona',
            price: 420000
        },
        {
            id: 'g-3',
            name: 'Frontend Web Dasturlash',
            subject: 'IT Dasturlash',
            teacherId: 't-3',
            days: 'Dushanba - Chorshanba - Juma',
            time: '16:00 - 18:00',
            room: 'IT Laboratoriya 1',
            price: 650000
        },
        {
            id: 'g-4',
            name: 'General English Intermediate',
            subject: 'Ingliz tili',
            teacherId: 't-1',
            days: 'Seshanba - Payshanba - Shanba',
            time: '10:00 - 11:30',
            room: '103-xona',
            price: 390000
        },
        {
            id: 'g-5',
            name: 'Rus tili Intensiv',
            subject: 'Rus tili',
            teacherId: 't-4',
            days: 'Dushanba - Chorshanba - Juma',
            time: '15:00 - 16:30',
            room: '105-xona',
            price: 360000
        }
    ],

    students: [
        {
            id: 's-1',
            name: 'Azizbek Qodirov',
            phone: '+998 90 321-11-22',
            parentPhone: '+998 91 111-22-33',
            groupId: 'g-1',
            joinDate: '2026-09-15',
            paymentStatus: 'paid', // paid, debt, partial
            debtAmount: 0,
            avatar: 'AQ',
            status: 'active'
        },
        {
            id: 's-2',
            name: 'Madinabonu Karimova',
            phone: '+998 94 555-44-33',
            parentPhone: '+998 93 222-33-44',
            groupId: 'g-1',
            joinDate: '2026-09-20',
            paymentStatus: 'debt',
            debtAmount: 480000,
            avatar: 'MK',
            status: 'active'
        },
        {
            id: 's-3',
            name: 'Shohjahon Rustamov',
            phone: '+998 97 123-88-99',
            parentPhone: '+998 90 999-88-77',
            groupId: 'g-3',
            joinDate: '2026-10-01',
            paymentStatus: 'partial',
            debtAmount: 250000,
            avatar: 'SR',
            status: 'active'
        },
        {
            id: 's-4',
            name: 'Dilnoza Ahmadaliyeva',
            phone: '+998 99 777-66-55',
            parentPhone: '+998 98 444-55-66',
            groupId: 'g-2',
            joinDate: '2026-08-10',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'DA',
            status: 'active'
        },
        {
            id: 's-5',
            name: 'Jasur Mirzayev',
            phone: '+998 93 333-77-11',
            parentPhone: '+998 94 123-99-00',
            groupId: 'g-2',
            joinDate: '2026-09-01',
            paymentStatus: 'debt',
            debtAmount: 420000,
            avatar: 'JM',
            status: 'active'
        },
        {
            id: 's-6',
            name: 'Mohira Saidova',
            phone: '+998 90 666-33-22',
            parentPhone: '+998 91 777-88-99',
            groupId: 'g-3',
            joinDate: '2026-10-10',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'MS',
            status: 'active'
        },
        {
            id: 's-7',
            name: 'Bekzod Fayzullayev',
            phone: '+998 95 111-22-44',
            parentPhone: '+998 90 555-66-77',
            groupId: 'g-4',
            joinDate: '2026-10-15',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'BF',
            status: 'active'
        },
        {
            id: 's-8',
            name: 'Gulbahor Tojiyeva',
            phone: '+998 99 222-11-00',
            parentPhone: '+998 93 888-11-22',
            groupId: 'g-5',
            joinDate: '2026-09-25',
            paymentStatus: 'debt',
            debtAmount: 360000,
            avatar: 'GT',
            status: 'active'
        },
        {
            id: 's-9',
            name: 'Umidjon Narziyev',
            phone: '+998 97 444-99-88',
            parentPhone: '+998 90 333-22-11',
            groupId: 'g-1',
            joinDate: '2026-10-05',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'UN',
            status: 'active'
        },
        {
            id: 's-10',
            name: 'Sevara Ergasheva',
            phone: '+998 91 888-77-66',
            parentPhone: '+998 99 444-33-22',
            groupId: 'g-4',
            joinDate: '2026-10-18',
            paymentStatus: 'partial',
            debtAmount: 140000,
            avatar: 'SE',
            status: 'active'
        },
        {
            id: 's-11',
            name: 'Bobur Mansurov',
            phone: '+998 90 711-22-99',
            parentPhone: '+998 91 222-33-44',
            groupId: 'g-3',
            joinDate: '2026-10-25',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'BM',
            status: 'active'
        },
        {
            id: 's-12',
            name: 'Laylo Sobirova',
            phone: '+998 94 888-99-00',
            parentPhone: '+998 90 111-00-22',
            groupId: 'g-5',
            joinDate: '2026-10-28',
            paymentStatus: 'paid',
            debtAmount: 0,
            avatar: 'LS',
            status: 'active'
        }
    ],

    // Attendance records
    // key: date_groupId e.g. "2026-11-02_g-1"
    attendance: [
        {
            id: 'att-1',
            date: '2026-11-02',
            groupId: 'g-1',
            teacherId: 't-1',
            records: {
                's-1': 'present',
                's-2': 'absent',
                's-9': 'present'
            },
            notes: "Bugun IELTS Reading True/False savollari tahlil qilindi."
        },
        {
            id: 'att-2',
            date: '2026-11-02',
            groupId: 'g-3',
            teacherId: 't-3',
            records: {
                's-3': 'present',
                's-6': 'present',
                's-11': 'late'
            },
            notes: "React Hooks va State Management amaliyoti."
        },
        {
            id: 'att-3',
            date: '2026-10-31',
            groupId: 'g-2',
            teacherId: 't-2',
            records: {
                's-4': 'present',
                's-5': 'excused'
            },
            notes: "Murakkab geometriya masalalari yechildi."
        }
    ],

    // Financial Records (Incomes and Expenses)
    finance: [
        {
            id: 'f-1',
            type: 'income', // 'income' or 'expense'
            category: 'Oylik to\'lov',
            studentId: 's-1',
            amount: 480000,
            date: '2026-11-01',
            paymentMethod: 'Payme / Click',
            description: 'Azizbek Qodirov - Noyabr oyi to\'lovi'
        },
        {
            id: 'f-2',
            type: 'income',
            category: 'Oylik to\'lov',
            studentId: 's-4',
            amount: 420000,
            date: '2026-11-01',
            paymentMethod: 'Naqd pul',
            description: 'Dilnoza Ahmadaliyeva - Matematika to\'lovi'
        },
        {
            id: 'f-3',
            type: 'income',
            category: 'Oylik to\'lov',
            studentId: 's-6',
            amount: 650000,
            date: '2026-10-30',
            paymentMethod: 'Karta orqali',
            description: 'Mohira Saidova - Frontend kursi to\'lovi'
        },
        {
            id: 'f-4',
            type: 'income',
            category: 'Oylik to\'lov',
            studentId: 's-7',
            amount: 390000,
            date: '2026-10-29',
            paymentMethod: 'Payme / Click',
            description: 'Bekzod Fayzullayev - General English'
        },
        {
            id: 'f-5',
            type: 'income',
            category: 'Kitob va qo\'llanmalar',
            studentId: null,
            amount: 250000,
            date: '2026-10-28',
            paymentMethod: 'Naqd pul',
            description: '5 ta IELTS Cambridge kitoblari sotuvi'
        },
        {
            id: 'f-6',
            type: 'income',
            category: 'Oylik to\'lov',
            studentId: 's-11',
            amount: 650000,
            date: '2026-10-26',
            paymentMethod: 'Naqd pul',
            description: 'Bobur Mansurov - Frontend kursi to\'lovi'
        },
        // Expenses
        {
            id: 'f-7',
            type: 'expense',
            category: 'O\'qituvchilar oyligi',
            amount: 5000000,
            date: '2026-10-31',
            paymentMethod: 'Bank orqali',
            description: 'Nodira Xalimova (Matematika) - Oktabr oyi maoshi'
        },
        {
            id: 'f-8',
            type: 'expense',
            category: 'O\'quv binosi ijarasi (Arenda)',
            amount: 6000000,
            date: '2026-10-25',
            paymentMethod: 'Bank orqali',
            description: 'Markaz binosining oylik ijara to\'lovi'
        },
        {
            id: 'f-9',
            type: 'expense',
            category: 'Kommunal va Internet',
            amount: 850000,
            date: '2026-10-28',
            paymentMethod: 'Karta orqali',
            description: 'Optik tolali internet va elektr energiyasi'
        },
        {
            id: 'f-10',
            type: 'expense',
            category: 'Reklama & Target (SMM)',
            amount: 1200000,
            date: '2026-10-20',
            paymentMethod: 'Karta orqali',
            description: 'Instagram va Telegramda yangi guruhlar uchun reklama'
        },
        {
            id: 'f-11',
            type: 'expense',
            category: 'Kantselyariya va jihozlar',
            amount: 450000,
            date: '2026-10-22',
            paymentMethod: 'Naqd pul',
            description: 'Printer bo\'yoqlari, A4 qog\'ozlar va markerlar'
        }
    ]
};

// Database Management Class
class RenesansDB {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
            this.seed();
        }
    }

    seed() {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_DATA.students));
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_DATA.teachers));
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_DATA.groups));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_DATA.attendance));
        localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(INITIAL_DATA.finance));
    }

    resetAll() {
        this.seed();
    }

    // Generic Getters & Setters
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            console.error('Error reading localStorage for key: ' + key, e);
            return [];
        }
    }

    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage for key: ' + key, e);
        }
    }

    // STUDENTS API
    getStudents() {
        return this.get(STORAGE_KEYS.STUDENTS);
    }

    getStudentById(id) {
        return this.getStudents().find(s => s.id === id);
    }

    addStudent(student) {
        const students = this.getStudents();
        const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const newStudent = {
            id: 's-' + Date.now(),
            avatar: initials || 'OQ',
            status: 'active',
            paymentStatus: student.paymentStatus || 'paid',
            debtAmount: Number(student.debtAmount) || 0,
            joinDate: student.joinDate || new Date().toISOString().split('T')[0],
            ...student
        };
        students.unshift(newStudent);
        this.set(STORAGE_KEYS.STUDENTS, students);
        return newStudent;
    }

    updateStudent(id, updatedData) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updatedData };
            this.set(STORAGE_KEYS.STUDENTS, students);
            return students[index];
        }
        return null;
    }

    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== id);
        this.set(STORAGE_KEYS.STUDENTS, students);
    }

    // TEACHERS API
    getTeachers() {
        return this.get(STORAGE_KEYS.TEACHERS);
    }

    getTeacherById(id) {
        return this.getTeachers().find(t => t.id === id);
    }

    addTeacher(teacher) {
        const teachers = this.getTeachers();
        const initials = teacher.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const newTeacher = {
            id: 't-' + Date.now(),
            avatar: initials || 'UQ',
            status: 'active',
            salary: Number(teacher.salary) || 4000000,
            ...teacher
        };
        teachers.unshift(newTeacher);
        this.set(STORAGE_KEYS.TEACHERS, teachers);
        return newTeacher;
    }

    updateTeacher(id, updatedData) {
        const teachers = this.getTeachers();
        const index = teachers.findIndex(t => t.id === id);
        if (index !== -1) {
            teachers[index] = { ...teachers[index], ...updatedData };
            this.set(STORAGE_KEYS.TEACHERS, teachers);
            return teachers[index];
        }
        return null;
    }

    deleteTeacher(id) {
        let teachers = this.getTeachers();
        teachers = teachers.filter(t => t.id !== id);
        this.set(STORAGE_KEYS.TEACHERS, teachers);
    }

    // GROUPS API
    getGroups() {
        return this.get(STORAGE_KEYS.GROUPS);
    }

    getGroupById(id) {
        return this.getGroups().find(g => g.id === id);
    }

    addGroup(group) {
        const groups = this.getGroups();
        const newGroup = {
            id: 'g-' + Date.now(),
            price: Number(group.price) || 400000,
            ...group
        };
        groups.push(newGroup);
        this.set(STORAGE_KEYS.GROUPS, groups);
        return newGroup;
    }

    // ATTENDANCE API
    getAttendance() {
        return this.get(STORAGE_KEYS.ATTENDANCE);
    }

    saveAttendanceRecord(groupId, date, teacherId, records, notes = '') {
        const attendanceList = this.getAttendance();
        const existingIndex = attendanceList.findIndex(a => a.groupId === groupId && a.date === date);

        const attendanceEntry = {
            id: existingIndex !== -1 ? attendanceList[existingIndex].id : 'att-' + Date.now(),
            groupId,
            date,
            teacherId,
            records,
            notes,
            timestamp: new Date().toISOString()
        };

        if (existingIndex !== -1) {
            attendanceList[existingIndex] = attendanceEntry;
        } else {
            attendanceList.unshift(attendanceEntry);
        }

        this.set(STORAGE_KEYS.ATTENDANCE, attendanceList);
        return attendanceEntry;
    }

    getAttendanceForGroupAndDate(groupId, date) {
        return this.getAttendance().find(a => a.groupId === groupId && a.date === date);
    }

    // FINANCE API
    getFinance() {
        return this.get(STORAGE_KEYS.FINANCE);
    }

    addFinanceRecord(record) {
        const finance = this.getFinance();
        const newRecord = {
            id: 'f-' + Date.now(),
            amount: Number(record.amount) || 0,
            date: record.date || new Date().toISOString().split('T')[0],
            ...record
        };
        finance.unshift(newRecord);
        this.set(STORAGE_KEYS.FINANCE, finance);

        // If it's a student payment, update student debt if applicable
        if (record.studentId && record.type === 'income') {
            const student = this.getStudentById(record.studentId);
            if (student) {
                const newDebt = Math.max(0, (student.debtAmount || 0) - newRecord.amount);
                this.updateStudent(student.id, {
                    debtAmount: newDebt,
                    paymentStatus: newDebt === 0 ? 'paid' : 'partial'
                });
            }
        }

        return newRecord;
    }

    // FINANCE CALCULATIONS FOR MANAGER PANEL
    getFinancialSummary() {
        const list = this.getFinance();
        let totalIncome = 0;
        let totalExpense = 0;

        list.forEach(item => {
            if (item.type === 'income') totalIncome += Number(item.amount);
            if (item.type === 'expense') totalExpense += Number(item.amount);
        });

        const netProfit = totalIncome - totalExpense;
        const students = this.getStudents();
        const totalDebtors = students.filter(s => s.paymentStatus === 'debt' || s.paymentStatus === 'partial');
        const totalDebtAmount = totalDebtors.reduce((sum, s) => sum + (Number(s.debtAmount) || 0), 0);

        return {
            totalIncome,
            totalExpense,
            netProfit,
            totalStudents: students.length,
            activeStudents: students.filter(s => s.status === 'active').length,
            totalDebtorsCount: totalDebtors.length,
            totalDebtAmount,
            groupsCount: this.getGroups().length,
            teachersCount: this.getTeachers().length
        };
    }
}

// Global instance
const db = new RenesansDB();
window.db = db;
