// ──────────────────────────────────────────────
//  SU Space – app.js
// ──────────────────────────────────────────────
let currentUser = null;
let rooms = [
  {
    id: 1,
    title: "Meeting Room 2",
    image: "meeting-room-2.jpg"
  },
  {
    id: 2,
    title: "Meeting Room 3",
    image: "meeting-room-3.jpg"
  }
];
let currentPage = 'dashboard';
let currentLang = localStorage.getItem('lang') || 'th';
let authMode = 'login';
let dashboardRefreshInterval = null;
let backgroundMonitorInterval = null;
let lastKnownPendingIds = new Set();

// ──── i18n ────
const i18n = {
    en: {
        home: "Home", rooms: "Rooms", schedule: "Schedule",
        book_room: "Book Room", my_bookings: "My Bookings",
        profile: "Profile", sign_out: "Sign Out",
        login: "Login", sign_up: "Sign Up",
        welcome_back: "Welcome back",
        quick_actions: "Quick Actions",
        find_room: "Browse Rooms", new_booking: "New Booking",
        search_placeholder: "Search rooms...",
        all_locations: "All Locations", floor1: "Floor 1", floor2: "Floor 2",
        seats: "seats", book_this_room: "Book This Room",
        meeting_room: "Meeting Room", date: "Date",
        start_time: "Start Time", end_time: "End Time",
        purpose: "Purpose",
        purpose_placeholder: "Team meeting, Project presentation...",
        confirm_booking: "Confirm Booking",
        room: "Room", time: "Time", status: "Status", action: "Action",
        cancel: "Cancel", no_bookings: "No bookings found",
        profile_details: "Profile Details", full_name: "Full Name",
        email: "Email", role: "Role", department: "Department",
        phone_number: "Phone Number", save_changes: "Save Changes",
        processing: "Processing...", saving: "Saving...",
        booking_success: "Booking confirmed!", profile_success: "Profile updated!",
        login_google: "Login with Google", error: "Error",
        confirm_cancel: "Cancel this booking?",
        no_account: "Don't have an account?", already_account: "Already have an account?",
        today_bookings: "Today's Bookings", available_now: "Available Now",
        total_rooms: "Total Rooms", your_bookings: "Your Total Bookings",
        room_schedule: "Room Schedule", select_date: "Select Date",
        free: "Free", busy: "Busy", confirmed: "Confirmed", cancelled: "Cancelled", pending: "Pending Confirmation",
        upcoming: "Upcoming", past: "Past",
        switch_to_th: "Switch to TH", switch_to_en: "Switch to EN",
        daily_limit: "3-hour daily limit",
        confirm_needed: "Confirmation Required",
        confirm_before_deadline: "Please confirm your booking at least 10 minutes before the start time.",
        booking_approaching: "Booking Approaching",
        confirm_now: "Confirm Now",
        remaining: "remaining"
    },
    th: {
        home: "หน้าแรก", rooms: "ห้องประชุม", schedule: "ตาราง",
        book_room: "จองห้อง", my_bookings: "การจองของฉัน",
        profile: "โปรไฟล์", sign_out: "ออกจากระบบ",
        login: "เข้าสู่ระบบ", sign_up: "สมัครสมาชิก",
        welcome_back: "ยินดีต้อนรับกลับ",
        quick_actions: "เมนูลัด",
        find_room: "ดูห้องประชุม", new_booking: "จองห้องใหม่",
        search_placeholder: "ค้นหาห้อง...",
        all_locations: "ทุกสถานที่", floor1: "ชั้น 1", floor2: "ชั้น 2",
        seats: "ที่นั่ง", book_this_room: "จองห้องนี้",
        meeting_room: "ห้องประชุม", date: "วันที่",
        start_time: "เวลาเริ่ม", end_time: "เวลาสิ้นสุด",
        purpose: "วัตถุประสงค์",
        purpose_placeholder: "การประชุมทีม, นำเสนองาน...",
        confirm_booking: "ยืนยันการจอง",
        room: "ห้อง", time: "เวลา", status: "สถานะ", action: "การดำเนินการ",
        cancel: "ยกเลิก", no_bookings: "ไม่พบข้อมูลการจอง",
        order_details: "รายละเอียดการจอง",
        profile_details: "ข้อมูลโปรไฟล์", full_name: "ชื่อ-นามสกุล",
        email: "อีเมล", role: "ตำแหน่ง", department: "แผนก",
        phone_number: "เบอร์โทรศัพท์", save_changes: "บันทึกการเปลี่ยนแปลง",
        processing: "กำลังประมวลผล...", saving: "กำลังบันทึก...",
        booking_success: "จองห้องสำเร็จ!", profile_success: "อัปเดตโปรไฟล์สำเร็จ!",
        login_google: "เข้าสู่ระบบด้วย Google", error: "ข้อผิดพลาด",
        confirm_cancel: "ยืนยันการยกเลิกการจองนี้?",
        no_account: "ยังไม่มีบัญชี?", already_account: "มีบัญชีอยู่แล้ว?",
        today_bookings: "การจองวันนี้", available_now: "ห้องว่างตอนนี้",
        total_rooms: "ห้องทั้งหมด", your_bookings: "การจองทั้งหมดของคุณ",
        room_schedule: "ตารางการใช้ห้อง", select_date: "เลือกวันที่",
        free: "ว่าง", busy: "ถูกจองแล้ว", confirmed: "ยืนยันแล้ว", cancelled: "ยกเลิกแล้ว", pending: "รอการยืนยัน",
        upcoming: "กำลังจะถึง", past: "ผ่านมาแล้ว",
        switch_to_th: "เปลี่ยนเป็น TH", switch_to_en: "เปลี่ยนเป็น EN",
        daily_limit: "จำกัด 3 ชม./วัน",
        confirm_needed: "ต้องยืนยันการจอง",
        confirm_before_deadline: "กรุณายืนยันการใช้งานอย่างน้อย 10 นาทีก่อนเวลาเริ่ม",
        booking_approaching: "เวลาการจองกำลังจะมาถึง",
        confirm_now: "ยืนยันตอนนี้",
        remaining: "เหลือเวลาอีก"
    }
};

function t(key) {
    return i18n[currentLang]?.[key] || i18n['en'][key] || key;
}

// ──── Helpers ────
function isAuthorizedDomain(email) {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return domain === 'su.ac.th' || domain === 'silpakorn.edu';
}

function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return currentLang === 'th'
        ? d.toLocaleDateString('th-TH', { weekday:'short', year:'numeric', month:'short', day:'numeric' })
        : d.toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}

function generateTimeOptions(isStart = false) {
    let options = '';
    for (let h = 8; h <= 18; h++) {
        for (let m of ['00', '30']) {
            if (h === 8 && m === '00') continue;
            if (!isStart && h === 8 && m === '30') continue;
            if (isStart && h === 18 && m === '00') continue;
            if (h === 18 && m === '30') break;
            const time = `${String(h).padStart(2,'0')}:${m}`;
            options += `<option value="${time}">${time}</option>`;
        }
    }
    return options;
}

// ──── Language ────
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('lang', currentLang);
    document.getElementById('lang-label').textContent = 'THA/EN';
    updateStaticText();
    navigate(currentPage);
}

function updateStaticText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang]?.[key]) el.innerText = i18n[currentLang][key];
    });
}

// ──── Auth ────
function checkLoginState() {
    const overlay = document.getElementById('login-overlay');
    
    // Check for guest parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('guest') === 'true') {
        loginAsGuest();
        return;
    }

    // Load currentUser from localStorage if not set
    if (!currentUser) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUserProfileUI();
        }
    }

    if (!currentUser) {
        overlay.classList.remove('hidden');
        updateAuthModeUI();
    } else {
        overlay.classList.add('hidden');
        navigate(currentPage);
    }
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    // Clear URL parameters to prevent auto-guest login loops
    const url = new URL(window.location);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
    checkLoginState();
}

// ──── Mobile Sidebar Toggle ────
function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('sidebar-open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('sidebar-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close sidebar on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeSidebar();
    }
});

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    updateAuthModeUI();
}

function updateAuthModeUI() {
    const btnText = document.getElementById('login-btn-text');
    const authToggle = document.getElementById('auth-toggle');
    if (authMode === 'login') {
        btnText.innerText = t('login');
        authToggle.innerHTML = `<span>${t('no_account')}</span> <a href="#" onclick="toggleAuthMode()" class="text-brand font-bold hover:underline">${t('sign_up')}</a>`;
    } else {
        btnText.innerText = t('sign_up');
        authToggle.innerHTML = `<span>${t('already_account')}</span> <a href="#" onclick="toggleAuthMode()" class="text-brand font-bold hover:underline">${t('login')}</a>`;
    }
}

async function handleLogin(type) {
    const overlay = document.getElementById('login-overlay');
    const btn = document.getElementById('login-btn');
    
    if (type === 'email') {
        const emailVal = document.getElementById('login-email').value;
        const passVal = document.getElementById('login-pass').value;
        if (!emailVal || !passVal) {
            alert(currentLang === 'th' ? 'กรุณากรอกอีเมลและรหัสผ่าน' : 'Please enter email and password');
            return;
        }

        if (!isAuthorizedDomain(emailVal)) {
            alert(currentLang === 'th' ? 'ระบบนี้สำหรับบัญชีมหาวิทยาลัยศิลปากรเท่านั้น' : 'This system is only for Silpakorn University accounts.');
            window.location.href = 'error.html';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
        
        currentUser = {
            id: 1,
            name: emailVal.split('@')[0],
            email: emailVal,
            role: "Student",
            department: "Information Technology",
            phone: "-"
        };
        
        // Save user for persistence
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Simulate a network request
        setTimeout(() => {
            updateUserProfileUI();
            overlay.classList.add('hidden');
            navigate('dashboard');
            
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="fas fa-sign-in-alt mr-2"></i><span id="login-btn-text">${t('login')}</span>`;
            }
        }, 800);
    }
}

function loginAsGuest() {
    const overlay = document.getElementById('login-overlay');
    currentUser = {
        id: 1,
        name: "Guest User",
        email: "guest@su.ac.th",
        role: "Visitor",
        department: "Guest Access",
        phone: "-"
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserProfileUI();
    if (overlay) overlay.classList.add('hidden');
    navigate('dashboard');
}

// ──── Google Identity Services Callback ────
let tokenClient;

function initGoogleClients() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '965934976198-2n050q41sei5fp9c07gknammiu2l1fi5.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
                // Will be handled in confirm process
            }
        },
    });
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function handleGoogleCredentialResponse(response) {
    const payload = decodeJwtResponse(response.credential);
    const email = payload.email;

    if (!isAuthorizedDomain(email)) {
        alert(currentLang === 'th' ? 'ระบบนี้สำหรับบัญชีมหาวิทยาลัยศิลปากรเท่านั้น' : 'This system is only for Silpakorn University accounts.');
        window.location.href = 'error.html';
        return;
    }
    
    currentUser = {
        id: 1, 
        name: payload.name,
        email: payload.email,
        role: "Student",
        department: "Silpakorn University",
        profile_image: payload.picture,
        phone: "-"
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserProfileUI();
    document.getElementById('login-overlay').classList.add('hidden');
    navigate('dashboard');
}

// ──── Profile UI ────
function updateUserProfileUI() {
    if (!currentUser) return;
    const name = currentUser.name || 'User';
    const avatarUrl = currentUser.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=41826e&color=fff`;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el[typeof val === 'string' && el.tagName === 'IMG' ? 'src' : 'innerText'] = val; };
    setEl('sidebar-name', name);
    setEl('sidebar-role', currentUser.department || 'Silpakorn University');
    document.getElementById('sidebar-avatar').src = avatarUrl;
    document.getElementById('header-avatar').src = avatarUrl;
    setEl('header-name', name);
    document.getElementById('header-date').textContent = new Date().toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ──── API ────
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const r = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return r;
    } catch (e) { clearTimeout(id); throw e; }
}

async function fetchProfile() {
    const r = await fetchWithTimeout('/api/profile');
    if (!r.ok) throw new Error('Cannot reach server');
    currentUser = await r.json();
    updateUserProfileUI();
}

async function fetchRooms() {
    const r = await fetchWithTimeout('/api/rooms');
    if (!r.ok) throw new Error('Cannot fetch rooms');
    rooms = await r.json();
}

async function fetchBookingsForDate(date) {
    const r = await fetch(`/api/bookings?date=${date}`);
    if (!r.ok) return [];
    return await r.json();
}

async function fetchMyBookings() {
    const r = await fetch('/api/my_bookings');
    if (!r.ok) return [];
    return await r.json();
}

// ──── Navigation ────
function navigate(page) {
    currentPage = page;
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    contentArea.innerHTML = '<div class="flex items-center justify-center h-full"><div class="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div></div>';

    const pageTitles = { dashboard: t('home'), rooms: t('rooms'), schedule: t('schedule'), book: t('book_room'), bookings: t('my_bookings'), profile: t('profile') };
    if (pageTitle) pageTitle.innerText = pageTitles[page] || page;

    setTimeout(() => {
        if (dashboardRefreshInterval) clearInterval(dashboardRefreshInterval);
        switch (page) {
            case 'dashboard':  
                renderDashboard(); 
                dashboardRefreshInterval = setInterval(renderDashboard, 30000);
                break;
            case 'rooms':      renderRooms(); break;
            case 'schedule':   renderSchedule(); break;
            case 'book':       renderBook(); break;
            case 'bookings':   renderBookings(); break;
            case 'profile':    renderProfile(); break;
        }
    }, 200);
}

// ──── Render: Dashboard ────
async function renderDashboard() {
    const area = document.getElementById('content-area');
    const today = getToday();
    const [todayBookings, myBookings] = await Promise.all([
        fetchBookingsForDate(today),
        fetchMyBookings()
    ]);

    const availableNow = rooms.filter(r => {
        const now = new Date().toTimeString().substring(0, 5);
        const isBookedNow = todayBookings.some(b => b.room_id === r.id && now >= b.start_time && now < b.end_time);
        return !isBookedNow;
    });

    const confirmedMine = myBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending Confirmation');
    const upcomingMine = confirmedMine.filter(b => {
        const bDate = new Date(`${b.date}T${b.end_time}`);
        return bDate > new Date();
    }).slice(0, 3);

    area.innerHTML = `
        <div class="animate-fade-in space-y-8">
            <!-- Hero -->
            <div class="bg-gradient-to-br from-[#2e6254] to-[#41826e] rounded-3xl p-8 text-white relative overflow-hidden">
                <div class="absolute right-0 top-0 opacity-10">
                    <i class="fas fa-building text-[180px]"></i>
                </div>
                <p class="text-white/70 text-sm font-medium mb-1">${new Date().toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
                <h2 class="text-3xl font-black mb-1">${t('welcome_back')},</h2>
                <h2 class="text-3xl font-black mb-4 text-white/90">${currentUser?.name || 'User'}!</h2>
                <div class="flex gap-3 flex-wrap">
                    <button onclick="navigate('rooms')" class="px-5 py-2.5 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all text-sm shadow-lg">
                        <i class="fas fa-search mr-2"></i>${t('find_room')}
                    </button>
                    <button onclick="navigate('book')" class="px-5 py-2.5 bg-white/20 border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all text-sm">
                        <i class="fas fa-plus mr-2"></i>${t('new_booking')}
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div class="bg-white rounded-2xl p-5 border border-gray-100 premium-shadow">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand"><i class="fas fa-door-open"></i></div>
                        <span class="text-2xl font-black text-gray-800">${availableNow.length}</span>
                    </div>
                    <p class="text-xs font-semibold text-gray-500">${t('available_now')}</p>
                </div>
                <div class="bg-white rounded-2xl p-5 border border-gray-100 premium-shadow">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500"><i class="fas fa-building"></i></div>
                        <span class="text-2xl font-black text-gray-800">${rooms.length}</span>
                    </div>
                    <p class="text-xs font-semibold text-gray-500">${t('total_rooms')}</p>
                </div>
            </div>

            <!-- Quick actions -->
            <div>
                <h3 class="font-bold text-gray-800 mb-4">${t('quick_actions')}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${rooms.map(r => {
                        const isBooked = todayBookings.some(b => {
                            const now = new Date().toTimeString().substring(0,5);
                            return b.room_id === r.id && now >= b.start_time && now < b.end_time;
                        });
                        const imgSrc = r.image || '#';
                        return `
                            <div onclick="navigate('book')" class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover-premium cursor-pointer">
                                <div class="h-28 relative overflow-hidden bg-gray-100">
                                    <img src="${imgSrc}" class="w-full h-full object-cover" alt="${r.room_name}" onerror="this.style.display='none'">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <span class="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${isBooked ? 'bg-red-500' : 'bg-brand'} text-white">${isBooked ? t('busy') : t('free')}</span>
                                </div>
                                <div class="p-3">
                                    <p class="font-semibold text-sm text-gray-800">${r.room_name}</p>
                                    <p class="text-xs text-gray-400"><i class="fas fa-users mr-1"></i>${r.capacity} ${t('seats')}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    // Confirmation banner logic removed as per requirements.
}

// ──── Render: Rooms ────
function renderRooms(filterQuery = '') {
    const area = document.getElementById('content-area');
    const filtered = filterQuery
        ? rooms.filter(r => r.room_name.toLowerCase().includes(filterQuery.toLowerCase()) || r.location.toLowerCase().includes(filterQuery.toLowerCase()))
        : rooms;

    area.innerHTML = `
        <div class="animate-fade-in space-y-6">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="relative flex-1">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input type="text" placeholder="${t('search_placeholder')}" value="${filterQuery}" oninput="renderRooms(this.value)" class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none shadow-sm">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${filtered.map(room => createRoomCard(room)).join('')}
            </div>
        </div>
    `;
}

function createRoomCard(room) {
    const tags = room.equipment.split(',').map(tag =>
        `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md">${tag.trim()}</span>`
    ).join('');

    const imgSrc = room.image || '';

    return `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover-premium transition-all">
            <div class="relative h-52 bg-gray-100 overflow-hidden">
                <img src="${imgSrc}" class="w-full h-full object-cover" alt="${room.room_name}" onerror="this.src='https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div class="absolute bottom-4 left-4 text-white">
                    <span class="text-xs font-semibold bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                        <i class="fas fa-map-marker-alt mr-1"></i>${room.location}
                    </span>
                </div>
                <span class="absolute top-4 right-4 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full shadow-lg">
                    <i class="fas fa-check-circle mr-1"></i>${room.status}
                </span>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-3">${room.room_name}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span><i class="fas fa-users mr-1 text-brand"></i>${room.capacity} ${t('seats')}</span>
                </div>
                <div class="flex flex-wrap gap-2 mb-5">${tags}</div>
                <button onclick="navigate('book')" class="w-full py-3 bg-brand-light hover:bg-brand hover:text-white text-brand font-semibold rounded-xl transition-all border border-brand/20">
                    <i class="fas fa-calendar-plus mr-2"></i>${t('book_this_room')}
                </button>
            </div>
        </div>
    `;
}

// ──── Render: Schedule ────
async function renderSchedule(selectedDate = getToday()) {
    const area = document.getElementById('content-area');
    area.innerHTML = `<div class="flex items-center justify-center h-full"><div class="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div></div>`;

    const bookings = await fetchBookingsForDate(selectedDate);

    const times = [];
    let t0 = new Date('2000-01-01T08:30:00');
    const tEnd = new Date('2000-01-01T18:00:00');
    while (t0 < tEnd) {
        times.push(t0.toTimeString().substring(0,5));
        t0.setMinutes(t0.getMinutes() + 30);
    }

    const now = new Date().toTimeString().substring(0,5);
    const isToday = selectedDate === getToday();

    const headerCells = `<div class="room-label"></div>` +
        times.map(ti => `<div class="time-header">${ti}</div>`).join('');

    const rows = rooms.map(room => {
        const roomBookings = bookings.filter(b => b.room_id === room.id);
        const slots = times.map(ti => {
            const isBooked = roomBookings.some(b => ti >= b.start_time && ti < b.end_time);
            const isPast = isToday && ti < now;
            let cls = 'timeline-slot';
            let title = '';
            if (isPast) { cls += ' past'; }
            else if (isBooked) {
                cls += ' busy';
                const b = roomBookings.find(b => ti >= b.start_time && ti < b.end_time);
                title = `title="${b?.purpose || 'Booked'}"`;
            } else {
                cls += ' free';
                title = `title="Click to book ${room.room_name} at ${ti}"`;
            }
            const clickHandler = (!isBooked && !isPast)
                ? `onclick="quickBook(${room.id}, '${ti}', '${selectedDate}')"`
                : '';
            return `<div class="${cls}" ${title} ${clickHandler}></div>`;
        }).join('');

        return `<div class="room-label border-t border-gray-100">${room.room_name}</div>${slots.replace(/<div class="timeline-slot/g, '<div class="timeline-slot border-t border-gray-100')}`;
    }).join('');

    area.innerHTML = `
        <div class="animate-fade-in space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${t('room_schedule')}</h2>
                    <p class="text-sm text-gray-400">${t('click_to_book') || 'Click a green slot to quick-book'}</p>
                </div>
                <input type="date" id="schedule-date-picker" value="${selectedDate}" min="${getToday()}" onchange="renderSchedule(this.value)"
                    class="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none text-sm shadow-sm">
            </div>

            <!-- Legend -->
            <div class="flex gap-4 text-xs font-medium text-gray-600">
                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-brand-light inline-block"></span>${t('free')}</span>
                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-red-200 inline-block"></span>${t('busy')}</span>
                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-gray-200 inline-block"></span>${t('past') || 'Past'}</span>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-4 premium-shadow overflow-hidden">
                <div class="timeline-grid" style="grid-template-columns: 140px repeat(${times.length}, 52px);">
                    ${headerCells}
                    ${rows}
                </div>
            </div>
        </div>
    `;
}

function quickBook(roomId, startTime, date) {
    currentPreset = { roomId, startTime, date };
    navigate('book');
}

let currentPreset = null;

// ──── Render: Book ────
function renderBook() {
    const area = document.getElementById('content-area');
    const today = getToday();
    const preset = currentPreset;
    currentPreset = null;

    area.innerHTML = `
        <div class="animate-fade-in max-w-2xl mx-auto">
            <div class="bg-white rounded-3xl p-8 border border-gray-100 premium-shadow">
                <h2 class="text-xl font-bold text-gray-800 mb-6"><i class="fas fa-calendar-plus text-brand mr-2"></i>${t('book_room')}</h2>
                <form id="booking-form" class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('meeting_room')}</label>
                        <select id="room_id" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none" onchange="updateRoomPreview()">
                            ${rooms.map(r => `<option value="${r.id}" ${preset?.roomId == r.id ? 'selected' : ''}>${r.room_name} — ${r.capacity} ${t('seats')}</option>`).join('')}
                        </select>
                    </div>
                    <!-- Room preview -->
                    <div id="room-preview" class="hidden rounded-xl overflow-hidden border border-gray-100"></div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('date')}</label>
                        <input type="date" id="date" required value="${preset?.date || today}" min="${today}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('start_time')}</label>
                            <select id="start_time" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                                ${generateTimeOptions(true).replace(`value="${preset?.startTime || '09:00'}"`, `value="${preset?.startTime || '09:00'}" selected`)}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('end_time')} <span class="text-gray-400 font-normal text-xs">(${t('daily_limit')})</span></label>
                            <select id="end_time" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                                ${generateTimeOptions(false)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('purpose')}</label>
                        <textarea id="purpose" required rows="3" placeholder="${t('purpose_placeholder')}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none resize-none"></textarea>
                    </div>
                    <div id="booking-msg" class="hidden"></div>
                    <button type="submit" class="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-all shadow-lg">
                        <i class="fas fa-check-circle mr-2"></i>${t('confirm_booking')}
                    </button>
                </form>
            </div>
        </div>
    `;

    updateRoomPreview();
    document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
}

function updateRoomPreview() {
    const select = document.getElementById('room_id');
    const preview = document.getElementById('room-preview');
    if (!select || !preview) return;
    const room = rooms.find(r => r.id == select.value);
    if (!room) return;
    const imgSrc = room.image || '';
    preview.classList.remove('hidden');
    preview.innerHTML = `
        <div class="relative h-36 bg-gray-100">
            <img src="${imgSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'" alt="${room.room_name}">
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
                <div class="text-white">
                    <p class="font-bold text-lg">${room.room_name}</p>
                    <p class="text-white/70 text-sm"><i class="fas fa-map-marker-alt mr-1"></i>${room.location} &nbsp; <i class="fas fa-users mr-1"></i>${room.capacity} seats</p>
                    <p class="text-white/60 text-xs mt-1">${room.equipment}</p>
                </div>
            </div>
        </div>
    `;
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const msgDiv = document.getElementById('booking-msg');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${t('processing')}`;
    msgDiv.className = 'hidden';

    const data = {
        room_id: parseInt(document.getElementById('room_id').value),
        date: document.getElementById('date').value,
        start_time: document.getElementById('start_time').value,
        end_time: document.getElementById('end_time').value,
        purpose: document.getElementById('purpose').value
    };

    try {
        const r = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await r.json();
        if (r.ok) {
            alert(currentLang === 'th' ? "จองห้องพักสำเร็จ!" : "Booking successful!");
            navigate('bookings');
        } else {
            msgDiv.className = 'p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm';
            msgDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${result.detail || 'Failed to book'}`;
            msgDiv.classList.remove('hidden');
        }
    } catch (err) {
        msgDiv.className = 'p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm';
        msgDiv.innerHTML = `<i class="fas fa-wifi mr-2"></i>Connection error. Is the server running?`;
        msgDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ──── Render: Pending Confirmation ────
let pendingCountdownInterval = null;

function renderPendingConfirmation(booking) {
    const area = document.getElementById('content-area');
    if (pendingCountdownInterval) clearInterval(pendingCountdownInterval);
    
    const startDate = new Date(`${booking.date}T${booking.start_time}:00`);
    const render = () => {
        const now = new Date();
        const deadlineAdjust = 10 * 60000;
        const confirmDeadline = new Date(startDate.getTime() - deadlineAdjust);
        
        const isExpired = now > confirmDeadline;
        const isWindowOpen = !isExpired;

        let statusText = isExpired ? (currentLang === 'th' ? "หมดเวลายืนยันแล้ว" : "Confirmation period has expired") 
                                   : (currentLang === 'th' ? "กรุณายืนยันการเข้าใช้งาน" : "Please confirm your attendance");
        let timerLabel = isExpired ? "" : (currentLang === 'th' ? "เหลือเวลายืนยันอีก" : "Confirmation time remaining");
        let targetTime = isExpired ? null : confirmDeadline;

        area.innerHTML = `
            <div class="animate-fade-in max-w-2xl mx-auto">
                <div class="bg-white rounded-3xl p-8 border ${isWindowOpen ? 'border-brand' : 'border-red-200'} premium-shadow">
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 ${isWindowOpen ? 'bg-brand-light text-brand' : 'bg-red-50 text-red-500'} rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${isWindowOpen ? 'border-brand-light' : 'border-red-100'}">
                            <i class="fas ${isWindowOpen ? 'fa-check' : 'fa-hourglass-end'} text-3xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">${t('pending')}</h2>
                        <p class="${isWindowOpen ? 'text-brand' : 'text-red-600'} font-medium">${statusText}</p>
                        <p class="text-sm text-gray-400 mt-2">${currentLang === 'th' ? 'กรุณายืนยันก่อนเวลาเริ่มใช้งาน 10 นาที' : 'Please confirm at least 10 minutes before start time.'}</p>
                    </div>
                    
                    ${targetTime ? `
                    <div class="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
                        <p class="text-xs text-gray-400 mb-2 uppercase font-bold tracking-widest">${timerLabel}</p>
                        <div class="text-5xl font-mono font-black text-gray-800 tracking-wider" id="countdown-timer">--:--</div>
                    </div>
                    ` : ''}
                    
                    <div class="space-y-4">
                        <button onclick="confirmBooking(${booking.id}, '${booking.room_name}', '${booking.date}', '${booking.start_time}', '${booking.end_time}', '${(booking.purpose||'').replace(/\n/g, '\\n').replace(/'/g, "\\'")}')" 
                            id="confirm-booking-btn" 
                            ${!isWindowOpen ? 'disabled' : ''}
                            class="w-full py-4 ${isWindowOpen ? 'bg-brand hover:bg-brand/90' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center text-lg">
                            <i class="fas fa-check-circle mr-2"></i>${currentLang === 'th' ? 'ยืนยันการเข้าใช้งาน' : 'Confirm Attendance'}
                        </button>
                        <button onclick="navigate('bookings')" class="w-full py-3 bg-white text-gray-500 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center">
                            <i class="fas fa-arrow-left mr-2"></i>${t('back') || 'กลับ'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (targetTime) {
            const timerElement = document.getElementById('countdown-timer');
            const updateTimer = () => {
                const diff = targetTime - new Date();
                if (diff <= 0) {
                    clearInterval(pendingCountdownInterval);
                    render();
                    return;
                }
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                if (timerElement) timerElement.textContent = String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0');
            };
            updateTimer();
            pendingCountdownInterval = setInterval(updateTimer, 1000);
        }
    };
    render();
}

// ──── Professional Modal ────
function showNotifModal(booking) {
    const modal = document.getElementById('notif-modal');
    const body = document.getElementById('notif-modal-body');
    const action = document.getElementById('notif-modal-action');
    
    body.innerHTML = `
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand">
                <i class="fas fa-door-open text-xl"></i>
            </div>
            <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">${t('room')}</p>
                <p class="font-bold text-gray-800">${booking.room_name}</p>
            </div>
        </div>
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand">
                <i class="fas fa-clock text-xl"></i>
            </div>
            <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">${t('time')}</p>
                <p class="font-bold text-gray-800">${booking.start_time} – ${booking.end_time}</p>
            </div>
        </div>
        <div class="text-center py-2">
            <p class="text-[10px] text-brand font-bold uppercase tracking-[0.2em] mb-1">${t('remaining')}</p>
            <div id="modal-countdown" class="text-4xl font-mono font-black text-gray-800">00:00</div>
        </div>
    `;

    action.innerHTML = `
        <button onclick="closeNotifModal(); confirmBooking(${booking.id}, '${booking.room_name}', '${booking.date}', '${booking.start_time}', '${booking.end_time}', '${(booking.purpose||'').replace(/\n/g, '\\n').replace(/'/g, "\\'")}')" 
            class="w-full py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-all shadow-lg text-sm">
            ${t('confirm_now')}
        </button>
    `;

    modal.classList.add('active');

    const startDate = new Date(`${booking.date}T${booking.start_time}:00`);
    const updateModalTimer = () => {
        const diff = (startDate.getTime() - 10 * 60000) - new Date().getTime();
        if (diff <= 0) {
            closeNotifModal();
            return;
        }
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const timerEl = document.getElementById('modal-countdown');
        if (timerEl) timerEl.textContent = String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0');
    };
    updateModalTimer();
    const interval = setInterval(updateModalTimer, 1000);
    modal.dataset.interval = interval;
}

function closeNotifModal() {
    const modal = document.getElementById('notif-modal');
    modal.classList.remove('active');
    if (modal.dataset.interval) clearInterval(parseInt(modal.dataset.interval));
}

// ──── Background Monitor ────
async function startBackgroundMonitor() {
    if (backgroundMonitorInterval) clearInterval(backgroundMonitorInterval);
    backgroundMonitorInterval = setInterval(async () => {
        if (!currentUser) return;
        const bookings = await fetchMyBookings();
        const pending = bookings.filter(b => b.status === 'Pending Confirmation');
        
        pending.forEach(b => {
            const startDate = new Date(`${b.date}T${b.start_time}:00`);
            const now = new Date();
            const timeToStart = startDate.getTime() - now.getTime();
            const tenMinsInMs = 10 * 60000;

            // Trigger if within the 10-minute window before start
            if (timeToStart > 0 && timeToStart <= tenMinsInMs) {
                if (!lastKnownPendingIds.has(b.id)) {
                    showNotifModal(b);
                    lastKnownPendingIds.add(b.id);
                }
            } else if (timeToStart > tenMinsInMs) {
                // If it's still far in the future, remove from tracking so it can trigger later
                lastKnownPendingIds.delete(b.id);
            }
        });
    }, 15000); // Check every 15 seconds
}

async function confirmBooking(bookingId, roomName, date, startTime, endTime, purpose) {
    const btn = document.getElementById('confirm-booking-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังประมวลผล...';

    const confirmWithBackend = async () => {
        const r = await fetch('/api/bookings/' + bookingId + '/confirm', { method: 'POST' });
        const result = await r.json();
        if (r.ok) {
            if (pendingCountdownInterval) clearInterval(pendingCountdownInterval);
            alert("ยืนยันการจองสำเร็จ!");
            navigate('bookings');
        } else {
            alert("ข้อผิดพลาด: " + (result.detail || "ไม่สามารถยืนยันได้ อาจหมดเวลาแล้ว"));
            navigate('bookings');
        }
    };

    try {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2 && tokenClient) {
            tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    await confirmWithBackend();
                    return;
                }
                const startDateTime = new Date(`${date}T${startTime}:00+07:00`).toISOString();
                const endDateTime = new Date(`${date}T${endTime}:00+07:00`).toISOString();
                const event = {
                  'summary': `Meeting Room Booking - SU Space`,
                  'location': 'NT Tower Bang Rak',
                  'description': `Room: ${roomName}\nPurpose: ${purpose}\nBooked by: ${currentUser?.name || 'User'}`,
                  'start': { 'dateTime': startDateTime, 'timeZone': 'Asia/Bangkok' },
                  'end': { 'dateTime': endDateTime, 'timeZone': 'Asia/Bangkok' }
                };
                try {
                    await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${resp.access_token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(event)
                    });
                } catch (e) {}
                await confirmWithBackend();
            };
            tokenClient.requestAccessToken({prompt: ''});
        } else {
            await confirmWithBackend();
        }
    } catch (err) {
        alert("การเชื่อมต่อมีปัญหา");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

// ──── Render: My Bookings ────
async function renderBookings() {
    const area = document.getElementById('content-area');
    const bookings = await fetchMyBookings();

    const rows = bookings.length > 0 ? bookings.map(b => {
        const isPast = new Date(`${b.date}T${b.end_time}`) < new Date();
        let statusLabel = '';
        if (b.status === 'Confirmed') {
            statusLabel = isPast ? `<span class="status-badge bg-gray-100 text-gray-500 border border-gray-200">${t('past')}</span>`
                                 : `<span class="status-badge status-confirmed">${t('confirmed')}</span>`;
        } else if (b.status === 'Pending Confirmation') {
            statusLabel = `<span class="status-badge status-pending animate-bounce-subtle">${t('pending')}</span>`;
        } else {
            statusLabel = `<span class="status-badge status-cancelled">${t('cancelled')}</span>`;
        }
        return `
            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-all ${isPast ? 'opacity-60' : ''}">
                <td class="px-6 py-4">
                    <p class="font-semibold text-gray-800">${b.room_name}</p>
                    <p class="text-xs text-gray-400 mt-0.5">${b.purpose?.substring(0,40)}${b.purpose?.length > 40 ? '...' : ''}</p>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${formatDate(b.date)}</td>
                <td class="px-6 py-4 text-sm text-gray-600 font-mono">${b.start_time} – ${b.end_time}</td>
                <td class="px-6 py-4">${statusLabel}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        ${b.status === 'Pending Confirmation' && !isPast
                            ? `<button onclick="renderPendingConfirmation(${JSON.stringify(b).replace(/"/g, '&quot;')})" class="text-brand hover:text-brand-dark font-bold text-sm transition-all hover:underline"><i class="fas fa-check-circle mr-1"></i>ยืนยัน</button>`
                            : ''}
                        ${(b.status === 'Confirmed' || b.status === 'Pending Confirmation') && !isPast
                            ? `<button onclick="cancelBooking(${b.id})" class="text-red-500 hover:text-red-700 font-medium text-sm transition-all hover:underline"><i class="fas fa-times-circle mr-1"></i>${t('cancel')}</button>`
                            : '—'}
                    </div>
                </td>
            </tr>
        `;
    }).join('') : `<tr><td colspan="5" class="text-center py-16 text-gray-400"><div class="flex flex-col items-center gap-3"><i class="fas fa-calendar-times text-3xl"></i><p>${t('no_bookings')}</p><button onclick="navigate('book')" class="px-4 py-2 bg-brand text-white text-sm rounded-xl font-semibold hover:bg-brand/90 transition-all">${t('new_booking')}</button></div></td></tr>`;

    area.innerHTML = `
        <div class="animate-fade-in">
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden premium-shadow">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="font-bold text-gray-800">${t('my_bookings')}</h2>
                    <button onclick="navigate('book')" class="px-4 py-2 bg-brand text-white text-sm rounded-xl font-semibold hover:bg-brand/90 transition-all">
                        <i class="fas fa-plus mr-1"></i>${t('new_booking')}
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <th class="px-6 py-3">${t('room')}</th>
                                <th class="px-6 py-3">${t('date')}</th>
                                <th class="px-6 py-3">${t('time')}</th>
                                <th class="px-6 py-3">${t('status')}</th>
                                <th class="px-6 py-3">${t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function cancelBooking(id) {
    if (!confirm(t('confirm_cancel'))) return;
    try {
        const r = await fetch(`/api/cancel_booking/${id}`, { method: 'POST' });
        const result = await r.json();
        if (result.success) renderBookings();
        else alert(result.detail || t('error'));
    } catch (err) {
        alert(t('error'));
    }
}

// ──── Render: Profile ────
function renderProfile() {
    const area = document.getElementById('content-area');
    const u = currentUser;
    const avatarUrl = u.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=128&background=41826e&color=fff`;

    area.innerHTML = `
        <div class="animate-fade-in max-w-2xl mx-auto space-y-6">
            <div class="bg-white rounded-3xl p-8 border border-gray-100 premium-shadow">
                <div class="flex items-center space-x-6 mb-8">
                    <div class="relative">
                        <img id="profile-img" src="${avatarUrl}" class="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white ring-2 ring-brand/20" alt="Profile">
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-gray-800">${u.name}</h2>
                        <p class="text-gray-400 text-sm">${u.email}</p>
                    </div>
                </div>

                <form id="profile-form" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('full_name')}</label>
                            <input type="text" id="prof_name" value="${u.name}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">${t('email')}</label>
                            <input type="email" id="prof_email" value="${u.email}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">${t('phone_number')}</label>
                        <input type="text" id="prof_phone" value="${u.phone || ''}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none">
                    </div>
                    <div id="profile-msg" class="hidden"></div>
                    <button type="submit" class="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-all shadow-lg">
                        <i class="fas fa-save mr-2"></i>${t('save_changes')}
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('profile-form').addEventListener('submit', handleProfileSubmit);
}

async function handleProfileSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const msgDiv = document.getElementById('profile-msg');
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${t('saving')}`;

    const data = {
        name: document.getElementById('prof_name').value,
        email: document.getElementById('prof_email').value,
        role: "Student",
        department: "Information Technology",
        phone: document.getElementById('prof_phone').value
    };

    try {
        const r = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (r.ok) {
            currentUser = await r.json();
            updateUserProfileUI();
            msgDiv.className = 'p-4 bg-brand-light border border-brand-light text-brand rounded-xl text-sm font-semibold';
            msgDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${t('profile_success')}`;
            msgDiv.classList.remove('hidden');
            setTimeout(() => renderProfile(), 1500);
        } else {
            throw new Error('Update failed');
        }
    } catch (err) {
        msgDiv.className = 'p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm';
        msgDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${t('error')}`;
        msgDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-save mr-2"></i>${t('save_changes')}`;
    }
}

// ──── Init ────
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('lang-label').textContent = 'THA/EN';
    updateStaticText();

    try {
        await fetchRooms();
        checkLoginState();
        startBackgroundMonitor();
    } catch (err) {
        document.getElementById('content-area').innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center max-w-sm">
                    <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-plug text-red-500 text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Cannot Connect to Server</h2>
                    <p class="text-gray-500 mb-6 text-sm">Make sure <code class="bg-gray-100 px-1 rounded">run.bat</code> is running, then refresh.</p>
                    <button onclick="window.location.reload()" class="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all">
                        <i class="fas fa-redo mr-2"></i>Retry
                    </button>
                </div>
            </div>
        `;
        document.getElementById('login-overlay').classList.remove('hidden');
    }
});
