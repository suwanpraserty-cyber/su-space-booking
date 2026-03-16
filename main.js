// ============================================================
// SU Space — Main JavaScript
// ============================================================

let currentLang = localStorage.getItem('su_space_lang') || 'th';
let currentUser = null;

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
    en: {
        app_subtitle: "Meeting Room Booking System",
        nav_home: "Home", nav_rooms: "Rooms", nav_reserve: "Book Room",
        nav_my_bookings: "My Bookings", nav_profile: "Profile",
        total_rooms: "Total Rooms", available_today: "Available Rooms",
        all_rooms_title: "All Meeting Rooms", rooms_subtitle: "Find and book the perfect space for your meeting.",
        status_available: "Available", status_booked: "Booked",
        book_now_btn: "Book Now",
        search_hint: "Search room or building...", search_btn: "Search", all_capacities: "All Capacities",
        my_bookings_title: "My Bookings", my_bookings_subtitle: "Manage your upcoming and past reservations.",
        my_bookings_header: "All Your Bookings",
        table_room: "Room", table_date: "Date", table_time: "Time",
        table_purpose: "Purpose", table_status: "Status", table_action: "Action",
        status_confirmed: "Confirmed", status_completed: "Completed",
        cancel_booking_btn: "Cancel", no_bookings_found: "No bookings yet. Try booking a room!",
        not_allowed: "N/A",
        booking_form_title: "Room Booking Form", reserve_subtitle: "Choose a time slot and confirm your reservation.",
        select_room_label: "Select Room", choose_room_placeholder: "Choose a room...",
        date_label: "Date", start_time_label: "Start Time", end_time_label: "End Time",
        purpose_label: "Purpose", purpose_placeholder: "e.g. Group study, Club meeting...",
        confirm_reserve_btn: "Confirm Reservation",
        important_note_title: "Important Note",
        important_note_desc: "Bookings are limited to 3 hours. Arrive on time or the booking may be cancelled after 15 mins.",
        profile_title: "Profile", profile_subtitle: "Manage your account settings.",
        full_name_label: "Full Name", email_label: "Email", phone_label: "Phone Number",
        save_data_btn: "Save Profile Changes", profile_user_type: "SU Space User",
        login_title: "Sign In", full_name: "Full Name", student_id: "Student ID / Email",
        sign_in: "Sign In", or: "or", sign_in_google: "Sign in with Google",
        login_footer: "Meeting room booking system for Silpakorn University",
        login_google: "Sign in with Google", logout: "Sign Out",
        guest_welcome_title: "Welcome to SU Space",
        guest_welcome_subtitle: "The modern meeting room booking system for Silpakorn University.",
        guest_login_btn: "Sign in with Google", manual_login_link: "Manual Student Login",
    },
    th: {
        app_subtitle: "ระบบจองห้องประชุม",
        nav_home: "หน้าหลัก", nav_rooms: "ห้องประชุม", nav_reserve: "จองห้อง",
        nav_my_bookings: "การจองของฉัน", nav_profile: "โปรไฟล์",
        total_rooms: "ห้องทั้งหมด", available_today: "ห้องว่าง",
        all_rooms_title: "ห้องประชุมทั้งหมด", rooms_subtitle: "ค้นหาพื้นที่ที่เหมาะสมสำหรับทีมของคุณ",
        status_available: "ว่าง", status_booked: "จองแล้ว",
        book_now_btn: "จองตอนนี้",
        search_hint: "ค้นหาชื่อห้องหรืออาคาร...", search_btn: "ค้นหา", all_capacities: "ทุกขนาดความจุ",
        my_bookings_title: "การจองของฉัน", my_bookings_subtitle: "จัดการรายการจองปัจจุบันและย้อนหลังของคุณ",
        my_bookings_header: "รายการจองของคุณทั้งหมด",
        table_room: "ห้อง", table_date: "วันที่", table_time: "เวลา",
        table_purpose: "วัตถุประสงค์", table_status: "สถานะ", table_action: "การจัดการ",
        status_confirmed: "ยืนยันแล้ว", status_completed: "เสร็จสิ้น",
        cancel_booking_btn: "ยกเลิก", no_bookings_found: "ยังไม่มีรายการจองของคุณ",
        not_allowed: "ไม่อนุญาต",
        booking_form_title: "แบบฟอร์มการจองห้อง", reserve_subtitle: "เลือกช่วงเวลาที่คุณต้องการและยืนยันการจอง",
        select_room_label: "เลือกห้องประชุม", choose_room_placeholder: "กรุณาเลือกห้อง...",
        date_label: "วันที่ต้องการใช้งาน", start_time_label: "เวลาเริ่ม", end_time_label: "เวลาสิ้นสุด",
        purpose_label: "วัตถุประสงค์ในการใช้ห้อง", purpose_placeholder: "เช่น ติวสอบ, ประชุมชมรม...",
        confirm_reserve_btn: "ยืนยันการจอง",
        important_note_title: "หมายเหตุสำคัญ",
        important_note_desc: "การจองจำกัดไม่เกิน 3 ชั่วโมงต่อเซสชัน โปรดมาถึงห้องตรงเวลา หากไม่มีการใช้งานเกิน 15 นาที การจองอาจถูกยกเลิกโดยอัตโนมัติ",
        profile_title: "โปรไฟล์", profile_subtitle: "จัดการบัญชีและข้อมูลส่วนตัวของคุณ",
        full_name_label: "ชื่อ-นามสกุล", email_label: "อีเมล", phone_label: "เบอร์โทรศัพท์",
        save_data_btn: "บันทึกข้อมูล", profile_user_type: "ผู้ใช้งานระบบ SU Space",
        login_title: "เข้าสู่ระบบ", full_name: "ชื่อ-นามสกุล", student_id: "รหัสนักศึกษา / อีเมล",
        sign_in: "เข้าสู่ระบบ", or: "หรือ", sign_in_google: "เข้าสู่ระบบด้วย Google",
        login_footer: "ระบบจองห้องประชุมสำหรับชาวศิลปากร",
        login_google: "เข้าสู่ระบบด้วย Google", logout: "ออกจากระบบ",
        guest_welcome_title: "ยินดีต้อนรับสู่ SU Space",
        guest_welcome_subtitle: "ระบบจองห้องประชุมที่ทันสมัยสำหรับชาวศิลปากร",
        guest_login_btn: "เข้าสู่ระบบด้วย Google", manual_login_link: "เข้าสู่ระบบด้วยรหัสนักศึกษา",
    }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    applyTranslations();
    setupLangToggle();

    await checkAuthStatus();

    const path = window.location.pathname;
    if (path === '/booking')   initBooking();
    if (path === '/profile')   initProfile();
});

// ============================================================
// LANGUAGE
// ============================================================
function setupLangToggle() {
    const btn  = document.getElementById('lang-toggle-btn');
    const text = document.getElementById('lang-text');
    if (!btn) return;

    if (text) text.textContent = currentLang.toUpperCase();

    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'th' : 'en';
        localStorage.setItem('su_space_lang', currentLang);
        if (text) text.textContent = currentLang.toUpperCase();
        applyTranslations();
    });
}

function applyTranslations() {
    const dict = T[currentLang] || T['th'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = dict[key];
        if (!val) return;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
        } else {
            // Preserve icons inside the element
            const icons = [...el.querySelectorAll('i, img')];
            const span = el.querySelector('span');
            if (span) {
                span.textContent = val;
            } else if (icons.length > 0) {
                // find text nodes only
                Array.from(el.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
                    .forEach(n => n.textContent = val);
            } else {
                el.textContent = val;
            }
        }
    });
}

// ============================================================
// AUTH CHECK
// ============================================================
async function checkAuthStatus() {
    try {
        const res = await fetch('/api/me');

        // Dom refs (new layout IDs)
        const userBlock   = document.getElementById('sidebar-user-block');
        const avatar      = document.getElementById('sidebar-avatar');
        const userName    = document.getElementById('sidebar-user-name');
        const userEmail   = document.getElementById('sidebar-user-email');
        const signoutBtn  = document.getElementById('sidebar-signout');
        const loginBtn    = document.getElementById('sidebar-login');
        const topAvatar   = document.getElementById('topbar-avatar');
        const topName     = document.getElementById('topbar-user-name');
        const guestBanner = document.getElementById('guest-banner');

        if (res.ok) {
            currentUser = await res.json();

            if (userBlock)  userBlock.classList.remove('hidden');
            if (signoutBtn) signoutBtn.classList.remove('hidden');
            if (loginBtn)   loginBtn.classList.add('hidden');

            if (avatar)    avatar.src            = currentUser.picture || '';
            if (userName)  userName.textContent   = currentUser.name    || '';
            if (userEmail) userEmail.textContent  = currentUser.email   || '';

            if (topAvatar) topAvatar.src          = currentUser.picture || '';
            if (topName)   topName.textContent    = (currentUser.name || 'User').split(' ')[0];

            if (guestBanner) guestBanner.classList.add('hidden');
        } else {
            if (userBlock)  userBlock.classList.add('hidden');
            if (signoutBtn) signoutBtn.classList.add('hidden');
            if (loginBtn)   loginBtn.classList.remove('hidden');

            if (topName)   topName.textContent = 'Guest';

            if (guestBanner) guestBanner.classList.remove('hidden');
        }
    } catch (e) {
        console.warn('Auth check failed:', e);
    }
}

// ============================================================
// BOOKING PAGE
// ============================================================
function initBooking() {
    populateTimeSelects();

    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min   = today;
    }

    const form = document.getElementById('booking-form');
    if (form) form.addEventListener('submit', handleBookingSubmit);
}

function populateTimeSelects() {
    const startSel = document.getElementById('start-time');
    const endSel   = document.getElementById('end-time');
    if (!startSel || !endSel) return;

    startSel.innerHTML = '';
    endSel.innerHTML   = '';

    let t = new Date('2000-01-01T08:30:00');
    const cap = new Date('2000-01-01T18:00:00');

    while (t <= cap) {
        const ts = t.toTimeString().slice(0, 5);

        // start: 08:30 to 17:30 (not 18:00)
        if (t < cap) {
            startSel.add(new Option(ts, ts));
        }
        // end: 09:00 to 18:00 (not 08:30)
        if (ts !== '08:30') {
            endSel.add(new Option(ts, ts));
        }

        t.setMinutes(t.getMinutes() + 30);
    }
}

async function handleBookingSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const msgDiv    = document.getElementById('booking-message');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังดำเนินการ...';

    const payload = {
        room_id:      document.getElementById('room-select')?.value,
        booking_date: document.getElementById('booking-date')?.value,
        start_time:   document.getElementById('start-time')?.value,
        end_time:     document.getElementById('end-time')?.value,
        purpose:      document.getElementById('purpose')?.value || ''
    };

    try {
        const res  = await fetch('/api/bookings', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });
        const data = await res.json();

        if (msgDiv) {
            msgDiv.className = res.ok
                ? 'alert alert-success'
                : 'alert alert-error';
            msgDiv.innerHTML = res.ok
                ? `<i class="fas fa-circle-check"></i><div>${data.message || 'จองห้องสำเร็จ!'}</div>`
                : `<i class="fas fa-circle-exclamation"></i><div>${data.error || 'เกิดข้อผิดพลาด'}</div>`;
        }

        if (res.ok) {
            setTimeout(() => { window.location.href = '/my-bookings'; }, 1500);
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> <span>ยืนยันการจอง</span>';
        }
    } catch (err) {
        console.error(err);
        if (msgDiv) {
            msgDiv.className = 'alert alert-error';
            msgDiv.innerHTML = '<i class="fas fa-circle-exclamation"></i><div>เกิดข้อผิดพลาดในการเชื่อมต่อ</div>';
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> <span>ยืนยันการจอง</span>';
    }
}

// ============================================================
// PROFILE PAGE
// ============================================================
function initProfile() {
    if (!currentUser) return;
    const nameInput   = document.getElementById('full-name');
    const emailInput  = document.getElementById('email');
    const avatarImg   = document.getElementById('profile-avatar');
    const nameHeader  = document.getElementById('profile-name-header');

    if (nameInput)  nameInput.value  = currentUser.name  || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (avatarImg)  avatarImg.src    = currentUser.picture || '';
    if (nameHeader) nameHeader.textContent = currentUser.name || '';
}

// ============================================================
// EXPOSE helpers globally
// ============================================================
window.handleCancelBooking = async function(id) {
    const dict = T[currentLang];
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) return;
    try {
        const res = await fetch(`/api/cancel_booking/${id}`, { method: 'POST' });
        if (res.ok) { location.reload(); }
        else {
            const d = await res.json();
            alert(d.error || 'เกิดข้อผิดพลาด');
        }
    } catch(e) { alert('เกิดข้อผิดพลาดในการเชื่อมต่อ'); }
};
