/**
 * MAIN.JS - LOGIC ĐIỀU KHIỂN & QUẢN LÝ TƯƠNG TÁC
 * Nền tảng Hỗ trợ Làm Bài Tập Nhóm (Frontend HTML/CSS/JS)
 * Tuân thủ đầy đủ yêu cầu Giai đoạn 2 & Strict Design System
 */

// ==========================================================================
// TIỆN ÍCH TOÀN CỤC (GLOBAL UTILITIES - SẴN SÀNG NGAY KHI TẢI FILE)
// ==========================================================================
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
window.escapeHTML = escapeHTML;

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "✓";
  if (type === "warning") icon = "⚠️";
  if (type === "danger") icon = "✕";

  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 1.1rem;">${icon}</span>
    <div style="flex: 1; font-size: 0.875rem;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Biến trạng thái toàn cục cho các bộ lọc
var appState = null;
var currentTaskFilter = "all";
var currentTaskSearchQuery = "";
var currentMemberSearchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  // 1. KHỞI TẠO STATE TỪ LOCALSTORAGE HOẶC DỮ LIỆU MẪU MOCKDATA
  appState = initAppState();

  // Kiểm tra xác thực: Nếu chưa đăng nhập, lập tức chuyển sang login.html
  if (isGuest()) {
    window.location.replace("login.html");
    return;
  }

  // 2. KHỞI TẠO CÁC SỰ KIỆN GIAO DIỆN CHÍNH
  initNavigation();
  initMobileDrawer();
  initAuthSystem();
  initModals();

  // 3. RENDER TẤT CẢ CÁC MODULE BAN ĐẦU
  renderAllModules();

  // ==========================================================================
  // HÀM KHỞI TẠO VÀ LƯU TRỮ LOCALSTORAGE
  // ==========================================================================
  function initAppState() {
    const saved = localStorage.getItem("TAM_APP_STATE");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Đảm bảo có đủ mảng dữ liệu cơ bản
        if (parsed && parsed.members && parsed.tasks) {
          return parsed;
        }
      } catch (e) {
        console.error("Lỗi khi đọc LocalStorage, khôi phục mockData mặc định", e);
      }
    }
    // Dữ liệu ban đầu từ window.mockData
    const initialState = JSON.parse(JSON.stringify(window.mockData));
    saveState(initialState);
    return initialState;
  }

  function saveState(state = appState) {
    localStorage.setItem("TAM_APP_STATE", JSON.stringify(state));
  }

  // ==========================================================================
  // ĐIỀU HƯỚNG TABS & GIAO DIỆN
  // ==========================================================================
  function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item[data-tab]");
    const panels = document.querySelectorAll(".tab-panel");
    const pageTitle = document.getElementById("pageTitle");
    const pageBreadcrumb = document.getElementById("pageBreadcrumb");

    const tabTitles = {
      "dashboard": { title: "Tổng quan & Tiến độ", breadcrumb: "Trang chủ / Bảng điều khiển" },
      "members": { title: "Quản lý Thành viên & Bầu chọn", breadcrumb: "Nhóm 05 / Thành viên" },
      "tasks": { title: "Bảng Phân công & Nhận nhiệm vụ", breadcrumb: "Nhiệm vụ / Danh sách phân công" },
      "chat": { title: "Trao đổi & Khung Chat Nhóm", breadcrumb: "Cộng tác / Tin nhắn trực tuyến" },
      "submissions": { title: "Nộp bài & Lịch sử chỉnh sửa", breadcrumb: "Đánh giá / Bản nộp v1.0 - v1.3" },
      "reports": { title: "Báo cáo Tiến độ & Xuất file", breadcrumb: "Báo cáo / Thống kê đánh giá" }
    };

    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = item.getAttribute("data-tab");

        navItems.forEach(n => n.classList.remove("active"));
        item.classList.add("active");

        panels.forEach(p => {
          p.classList.remove("active");
          if (p.id === `tab-${targetTab}`) {
            p.classList.add("active");
          }
        });

        if (tabTitles[targetTab]) {
          if (pageTitle) pageTitle.textContent = tabTitles[targetTab].title;
          if (pageBreadcrumb) pageBreadcrumb.textContent = tabTitles[targetTab].breadcrumb;
        }

        // Tự động đóng Sidebar trên Mobile sau khi bấm chọn Tab
        closeMobileSidebar();
      });
    });
  }

  // ==========================================================================
  // MOBILE DRAWER & HAMBURGER NAVIGATION
  // ==========================================================================
  function initMobileDrawer() {
    const hamburgerBtn = document.getElementById("btnHamburger");
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const closeBtn = document.getElementById("sidebarCloseBtn");

    function openMobileSidebar() {
      if (sidebar) sidebar.classList.add("sidebar-open");
      if (backdrop) backdrop.classList.add("active");
      document.body.style.overflow = "hidden"; // Ngăn cuộn body khi mở drawer
    }

    function closeMobileSidebar() {
      if (sidebar) sidebar.classList.remove("sidebar-open");
      if (backdrop) backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMobileSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeMobileSidebar);
    if (backdrop) backdrop.addEventListener("click", closeMobileSidebar);

    window.closeMobileSidebar = closeMobileSidebar;
  }

  // ==========================================================================
  // MODULE 1: AUTHENTICATION SYSTEM & USER SWITCHER
  // ==========================================================================
  const GUEST_USER = {
    id: "guest",
    name: "Khách (Chưa đăng nhập)",
    studentId: "---",
    email: "guest@edu.vn",
    role: "Khách",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    status: "offline"
  };

  function isGuest() {
    return !appState.currentUser || appState.currentUser.id === "guest";
  }

  function openAuthModal(startTab = "login") {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.classList.add("active");
      switchAuthTab(startTab);
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.classList.remove("active");
  }

  function switchAuthTab(tab) {
    // tabs
    const tabs = { login: "tabLogin", register: "tabRegister", switch: "tabSwitch" };
    // panels
    const panels = { login: "panelLogin", register: "panelRegister", switch: "panelSwitch" };

    Object.entries(tabs).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("active", key === tab);
    });
    Object.entries(panels).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.style.display = key === tab ? "block" : "none";
    });

    if (tab === "switch") renderQuickUserSwitcher();
    if (tab === "login") renderQuickLoginPills();
  }

  function doLogout() {
    appState.currentUser = { ...GUEST_USER };
    saveState();
    closeDropdown();
    // Chuyển hướng người dùng sang trang đăng nhập login.html
    window.location.replace("login.html?logout=true");
  }

  function doLogin(user) {
    appState.currentUser = { ...user };
    saveState();
    renderUserUI();
    renderAllModules();
    closeAuthModal();
    showToast(`Đăng nhập thành công! Xin chào ${user.name} 👋`, "success");
  }

  // --- Header dropdown ---
  let dropdownOpen = false;

  function openDropdown() {
    const menu = document.getElementById("userDropdownMenu");
    const btn = document.getElementById("btnHeaderProfile");
    if (menu) menu.classList.add("active");
    if (btn) btn.classList.add("active");
    dropdownOpen = true;
  }

  function closeDropdown() {
    const menu = document.getElementById("userDropdownMenu");
    const btn = document.getElementById("btnHeaderProfile");
    if (menu) menu.classList.remove("active");
    if (btn) btn.classList.remove("active");
    dropdownOpen = false;
  }

  function initAuthSystem() {
    // Cập nhật UI theo người dùng hiện tại
    renderUserUI();

    // ----- Auth Modal Tabs -----
    const tabLogin    = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    const tabSwitch   = document.getElementById("tabSwitch");
    const closeAuthBtn = document.getElementById("btnCloseAuth");

    if (tabLogin)    tabLogin.addEventListener("click",    () => switchAuthTab("login"));
    if (tabRegister) tabRegister.addEventListener("click", () => switchAuthTab("register"));
    if (tabSwitch)   tabSwitch.addEventListener("click",   () => switchAuthTab("switch"));
    if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal);

    // Close modal when clicking overlay
    const authModal = document.getElementById("authModal");
    if (authModal) {
      authModal.addEventListener("click", (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    // ----- Login Form -----
    const loginForm = document.getElementById("authLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("authEmail").value.trim().toLowerCase();
        const password = document.getElementById("authPassword").value;

        if (!query) { showToast("Vui lòng nhập Email hoặc MSSV sinh viên!", "warning"); return; }
        if (password.length < 6) { showToast("Mật khẩu cần tối thiểu 6 ký tự!", "warning"); return; }

        const existingMember = appState.members.find(m => 
          m.email.toLowerCase() === query || 
          m.studentId.toLowerCase() === query
        );
        if (existingMember) {
          doLogin(existingMember);
        } else {
          showToast("Tài khoản chưa có trong nhóm. Bạn có thể nhấn tab 'Đăng Ký' hoặc chọn ở 'Chọn Nhanh'!", "warning");
        }
      });
    }

    // ----- Register Form -----
    const registerForm = document.getElementById("authRegisterForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name      = document.getElementById("regName").value.trim();
        const studentId = document.getElementById("regStudentId").value.trim();
        const email     = document.getElementById("regEmail").value.trim();
        const password  = document.getElementById("regPassword").value;
        const passwordConfirm = document.getElementById("regPasswordConfirm").value;

        if (!name)      { showToast("Vui lòng nhập họ và tên!", "warning"); return; }
        if (!studentId) { showToast("Vui lòng nhập MSSV!", "warning"); return; }
        if (!email)     { showToast("Vui lòng nhập Email sinh viên!", "warning"); return; }
        if (password.length < 6) { showToast("Mật khẩu cần tối thiểu 6 ký tự!", "warning"); return; }
        if (password !== passwordConfirm) { showToast("Mật khẩu xác nhận không khớp!", "danger"); return; }

        const alreadyExists = appState.members.find(m => 
          m.email.toLowerCase() === email.toLowerCase() ||
          m.studentId.toLowerCase() === studentId.toLowerCase()
        );
        if (alreadyExists) { 
          showToast("Email hoặc MSSV này đã tồn tại trong nhóm. Hãy đăng nhập!", "warning"); 
          return; 
        }

        const newUser = {
          id: "mem-" + Date.now(),
          name,
          studentId,
          email,
          role: "Thành viên",
          skills: ["Thành viên mới"],
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          status: "online",
          tasksCompleted: 0,
          tasksActive: 0,
          votes: 0
        };
        appState.members.push(newUser);
        doLogin(newUser);
        showToast(`Tạo tài khoản thành công! Xin chào ${name} 🎉`, "success");
      });
    }

    // ----- Password Toggle Buttons -----
    const btnTogglePw = document.getElementById("btnTogglePassword");
    if (btnTogglePw) {
      btnTogglePw.addEventListener("click", () => {
        const pwInput = document.getElementById("authPassword");
        if (pwInput) {
          const isHidden = pwInput.type === "password";
          pwInput.type = isHidden ? "text" : "password";
          btnTogglePw.textContent = isHidden ? "🙈" : "👁";
        }
      });
    }
    const btnToggleRegPw = document.getElementById("btnToggleRegPassword");
    if (btnToggleRegPw) {
      btnToggleRegPw.addEventListener("click", () => {
        const pwInput = document.getElementById("regPassword");
        if (pwInput) {
          const isHidden = pwInput.type === "password";
          pwInput.type = isHidden ? "text" : "password";
          btnToggleRegPw.textContent = isHidden ? "🙈" : "👁";
        }
      });
    }

    // ----- Header Dropdown Toggle -----
    const btnHeaderProfile = document.getElementById("btnHeaderProfile");
    if (btnHeaderProfile) {
      btnHeaderProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdownOpen) closeDropdown(); else openDropdown();
      });
    }

    // Close dropdown when clicking elsewhere
    document.addEventListener("click", (e) => {
      if (dropdownOpen) {
        const wrapper = document.getElementById("headerUserWrapper");
        if (wrapper && !wrapper.contains(e.target)) closeDropdown();
      }
    });

    // Dropdown actions
    const btnDropdownSwitch  = document.getElementById("btnDropdownSwitch");
    const btnDropdownProfile = document.getElementById("btnDropdownProfile");
    const btnDropdownLogout  = document.getElementById("btnDropdownLogout");

    if (btnDropdownSwitch) {
      btnDropdownSwitch.addEventListener("click", () => {
        closeDropdown();
        openAuthModal("switch");
      });
    }
    if (btnDropdownProfile) {
      btnDropdownProfile.addEventListener("click", () => {
        closeDropdown();
        // Mở tab thành viên và cuộn đến thẻ của người dùng hiện tại
        const tabMem = document.querySelector('[data-tab="members"]');
        if (tabMem) tabMem.click();
        showToast("Đang xem hồ sơ cá nhân trong tab Thành viên.", "success");
      });
    }
    if (btnDropdownLogout) {
      btnDropdownLogout.addEventListener("click", () => {
        doLogout();
      });
    }

    // ----- Header Guest Buttons -----
    const btnHeaderLogin    = document.getElementById("btnHeaderLogin");
    const btnHeaderRegister = document.getElementById("btnHeaderRegister");
    if (btnHeaderLogin)    btnHeaderLogin.addEventListener("click",    () => window.location.href = "login.html");
    if (btnHeaderRegister) btnHeaderRegister.addEventListener("click", () => window.location.href = "login.html#register");

    // ----- Sidebar Buttons -----
    const btnSidebarSwitch  = document.getElementById("btnSidebarSwitch");
    const btnSidebarLogout  = document.getElementById("btnSidebarLogout");
    const btnSidebarLogin   = document.getElementById("btnSidebarLogin");

    if (btnSidebarSwitch) {
      btnSidebarSwitch.addEventListener("click", () => {
        if (window.closeMobileSidebar) window.closeMobileSidebar();
        openAuthModal("switch");
      });
    }
    if (btnSidebarLogout) {
      btnSidebarLogout.addEventListener("click", () => {
        if (window.closeMobileSidebar) window.closeMobileSidebar();
        doLogout();
      });
    }
    if (btnSidebarLogin) {
      btnSidebarLogin.addEventListener("click", () => {
        if (window.closeMobileSidebar) window.closeMobileSidebar();
        window.location.href = "login.html";
      });
    }

    // Render quick pills on first load
    renderQuickLoginPills();
  }

  function renderUserUI() {
    const u = appState.currentUser;
    const loggedIn = u && u.id !== "guest";

    // --- Header ---
    const headerWrapper      = document.getElementById("headerUserWrapper");
    const headerGuestActions = document.getElementById("headerGuestActions");
    if (headerWrapper)      headerWrapper.style.display      = loggedIn ? "flex" : "none";
    if (headerGuestActions) headerGuestActions.style.display = loggedIn ? "none" : "flex";

    if (loggedIn) {
      const headerAvatar = document.getElementById("headerUserAvatar");
      const headerName   = document.getElementById("headerUserName");
      const ddAvatar     = document.getElementById("dropdownAvatar");
      const ddName       = document.getElementById("dropdownUserName");
      const ddEmail      = document.getElementById("dropdownUserEmail");
      const ddRole       = document.getElementById("dropdownUserRole");
      const ddId         = document.getElementById("dropdownUserId");

      if (headerAvatar) headerAvatar.src = u.avatar || GUEST_USER.avatar;
      if (headerName)   headerName.textContent = u.name.split(" ").pop(); // Short name
      if (ddAvatar)     ddAvatar.src  = u.avatar || GUEST_USER.avatar;
      if (ddName)       ddName.textContent  = u.name;
      if (ddEmail)      ddEmail.textContent = u.email;
      if (ddRole)       ddRole.textContent  = u.role;
      if (ddId)         ddId.textContent    = u.studentId;
    }

    // --- Sidebar ---
    const sidebarLoggedIn = document.getElementById("sidebarLoggedInBox");
    const sidebarGuest    = document.getElementById("sidebarGuestBox");
    if (sidebarLoggedIn) sidebarLoggedIn.style.display = loggedIn ? "flex" : "none";
    if (sidebarGuest)    sidebarGuest.style.display    = loggedIn ? "none"  : "flex";

    if (loggedIn) {
      const sidebarAvatar = document.getElementById("sidebarUserAvatar");
      const sidebarName   = document.getElementById("sidebarUserName");
      const sidebarRole   = document.getElementById("sidebarUserRole");
      if (sidebarAvatar) sidebarAvatar.src = u.avatar || GUEST_USER.avatar;
      if (sidebarName)   sidebarName.textContent = u.name;
      if (sidebarRole)   sidebarRole.textContent = `${u.role} • ${u.studentId}`;
    }
  }

  function renderQuickLoginPills() {
    const container = document.getElementById("quickLoginPills");
    if (!container) return;
    container.innerHTML = appState.members.map(m => `
      <button class="auth-quick-pill" data-member-id="${m.id}">
        <img src="${escapeHTML(m.avatar)}" alt="${escapeHTML(m.name)}">
        ${escapeHTML(m.name.split(" ").pop())}
      </button>
    `).join("");

    container.querySelectorAll(".auth-quick-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const mId = btn.getAttribute("data-member-id");
        const found = appState.members.find(m => m.id === mId);
        if (found) doLogin(found);
      });
    });
  }

  function renderQuickUserSwitcher() {
    const grid = document.getElementById("quickUserSwitchGrid");
    if (!grid) return;

    grid.innerHTML = appState.members.map(m => {
      const isCurrent = appState.currentUser && appState.currentUser.id === m.id;
      return `
        <div class="user-switch-card ${isCurrent ? 'active' : ''}" data-user-id="${m.id}">
          <img src="${escapeHTML(m.avatar)}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
          <div style="min-width: 0; font-size: 0.8rem;">
            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(m.name)}</div>
            <div style="color: var(--text-muted); font-size: 0.7rem;">${escapeHTML(m.role)}</div>
          </div>
          ${isCurrent ? '<span style="font-size: 0.65rem; color: var(--color-primary); margin-left: auto;">✓ Đang dùng</span>' : ''}
        </div>
      `;
    }).join("");

    grid.querySelectorAll(".user-switch-card").forEach(card => {
      card.onclick = () => {
        const uId = card.getAttribute("data-user-id");
        const found = appState.members.find(m => m.id === uId);
        if (found) {
          doLogin(found);
          showToast(`Đã chuyển phiên làm việc sang: ${found.name} (${found.role})`, "success");
        }
      };
    });
  }

  // ==========================================================================
  // RENDER TẤT CẢ CÁC MODULE
  // ==========================================================================
  function renderAllModules() {
    renderDashboard();
    renderMembersAndElection();
    renderTasksModule();
    renderChatModule();
    renderSubmissionsModule();
    renderReportsModule();
  }

  // ==========================================================================
  // MODULE 9: RENDER DASHBOARD & MEMBER CONTRIBUTIONS
  // ==========================================================================
  function renderDashboard() {
    const total = appState.tasks.length;
    const done = appState.tasks.filter(t => t.status === "done").length;
    const inProgress = appState.tasks.filter(t => t.status === "in_progress").length;
    const todo = appState.tasks.filter(t => t.status === "todo").length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    // Cập nhật số liệu trên thẻ thống kê
    const elTotal = document.getElementById("statTotalTasks");
    const elDone = document.getElementById("statDoneTasks");
    const elInProgress = document.getElementById("statInProgressTasks");
    const elTodo = document.getElementById("statTodoTasks");
    const elPercent = document.getElementById("statPercentText");
    const elFill = document.getElementById("statProgressFill");

    if (elTotal) elTotal.textContent = total;
    if (elDone) elDone.textContent = done;
    if (elInProgress) elInProgress.textContent = inProgress;
    if (elTodo) elTodo.textContent = todo;
    if (elPercent) elPercent.textContent = `${percent}% Hoàn thành`;
    if (elFill) elFill.style.width = `${percent}%`;

    // Render bảng đóng góp theo từng thành viên
    const contribList = document.getElementById("memberContributionsList");
    if (contribList) {
      contribList.innerHTML = appState.members.map(m => {
        const completedCount = appState.tasks.filter(t => t.assigneeId === m.id && t.status === "done").length;
        const assignedCount = appState.tasks.filter(t => t.assigneeId === m.id).length;
        const contribPercent = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;

        return `
          <div class="contribution-item">
            <img src="${escapeHTML(m.avatar)}" class="contrib-avatar" alt="${escapeHTML(m.name)}">
            <div class="contrib-info">
              <div class="contrib-name-row">
                <span>${escapeHTML(m.name)} (${escapeHTML(m.role)})</span>
                <span style="color: var(--color-primary);">${completedCount}/${assignedCount} hoàn thành (${contribPercent}%)</span>
              </div>
              <div class="progress-track" style="height: 6px;">
                <div class="progress-fill" style="width: ${contribPercent}%;"></div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Render hoạt động gần đây
    const activityContainer = document.getElementById("recentActivitiesList");
    if (activityContainer && appState.activities) {
      activityContainer.innerHTML = appState.activities.map(act => `
        <div style="display: flex; gap: 0.875rem; padding: 0.875rem 0; border-bottom: 1px solid var(--border-color);">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-primary); margin-top: 6px; flex-shrink: 0;"></div>
          <div style="flex: 1; font-size: 0.875rem;">
            <strong>${escapeHTML(act.user)}</strong> ${escapeHTML(act.action)}: 
            <span style="color: var(--color-primary); font-weight: 500;">${escapeHTML(act.target)}</span>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${escapeHTML(act.time)}</div>
          </div>
        </div>
      `).join("");
    }
  }

  // ==========================================================================
  // MODULE 2 & 3: THÀNH VIÊN & BẦU CHỌN NHÓM TRƯỞNG
  // ==========================================================================
  function renderMembersAndElection() {
    // 1. Cập nhật thông tin mã nhóm & số lượng
    const codeDisplay = document.getElementById("memberGroupCodeDisplay");
    const countDisplay = document.getElementById("memberCountDisplay");
    if (codeDisplay) codeDisplay.textContent = appState.currentGroup.code;
    if (countDisplay) countDisplay.textContent = appState.members.length;

    // 2. Render Danh sách Thành viên (có lọc tìm kiếm)
    const membersListEl = document.getElementById("membersGrid");
    if (membersListEl) {
      let filteredMembers = appState.members;
      if (currentMemberSearchQuery) {
        const q = currentMemberSearchQuery.toLowerCase();
        filteredMembers = appState.members.filter(m => 
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.studentId.includes(q) ||
          m.skills.some(s => s.toLowerCase().includes(q))
        );
      }

      if (filteredMembers.length === 0) {
        membersListEl.innerHTML = `<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">Không tìm thấy thành viên phù hợp với từ khóa "${escapeHTML(currentMemberSearchQuery)}".</div>`;
      } else {
        membersListEl.innerHTML = filteredMembers.map(m => {
          const isLeader = m.role === "Nhóm trưởng";
          const completedCount = appState.tasks.filter(t => t.assigneeId === m.id && t.status === "done").length;
          const activeCount = appState.tasks.filter(t => t.assigneeId === m.id && t.status === "in_progress").length;

          return `
            <div class="member-card">
              <div class="member-card-header">
                <img src="${escapeHTML(m.avatar)}" alt="${escapeHTML(m.name)}" class="member-avatar">
                <div class="member-info">
                  <h4>${escapeHTML(m.name)}</h4>
                  <p>MSSV: ${escapeHTML(m.studentId)}</p>
                  <div style="margin-top: 0.25rem;">
                    <span class="badge ${isLeader ? 'badge-primary' : 'badge-neutral'}">${escapeHTML(m.role)}</span>
                    <span class="badge ${m.status === 'online' ? 'badge-success' : 'badge-neutral'}">${m.status === 'online' ? '● Online' : '○ Offline'}</span>
                  </div>
                </div>
              </div>
              <div class="member-skills">
                ${m.skills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join("")}
              </div>
              <div class="member-stats-row">
                <span>Đã xong: <strong>${completedCount} việc</strong></span>
                <span>Đang làm: <strong>${activeCount} việc</strong></span>
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
                <button class="btn btn-secondary btn-sm btn-edit-member" data-member-id="${m.id}" style="flex: 1;">
                  ✏️ Sửa thông tin
                </button>
              </div>
            </div>
          `;
        }).join("");

        // Gán sự kiện mở modal sửa thông tin thành viên
        membersListEl.querySelectorAll(".btn-edit-member").forEach(btn => {
          btn.onclick = () => {
            const mId = btn.getAttribute("data-member-id");
            openEditMemberModal(mId);
          };
        });
      }
    }

    // 3. Render Danh sách Bầu chọn Nhóm trưởng
    const candidatesGridEl = document.getElementById("candidatesGrid");
    if (candidatesGridEl) {
      let maxVotes = -1;
      appState.election.candidates.forEach(c => {
        if (c.votes > maxVotes) maxVotes = c.votes;
      });

      const totalVotes = appState.election.candidates.reduce((acc, c) => acc + c.votes, 0) || 1;

      candidatesGridEl.innerHTML = appState.election.candidates.map(c => {
        const isLeading = c.votes === maxVotes && maxVotes > 0;
        const candidateMember = appState.members.find(m => m.id === c.memberId) || {};
        const percentVote = Math.round((c.votes / totalVotes) * 100);

        return `
          <div class="candidate-card ${isLeading ? 'is-leading' : ''}">
            ${isLeading ? '<div class="leading-ribbon">👑 Đang dẫn đầu</div>' : ''}
            <img src="${escapeHTML(candidateMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}" class="candidate-avatar" alt="${escapeHTML(c.name)}">
            <div class="candidate-name">${escapeHTML(c.name)}</div>
            <div class="candidate-slogan">"${escapeHTML(c.slogan)}"</div>
            
            <div class="vote-tally-box">
              <div class="vote-number">
                <span>Số phiếu bầu</span>
                <span>${c.votes} phiếu (${percentVote}%)</span>
              </div>
              <div class="progress-track" style="margin-top: 0.5rem; height: 6px;">
                <div class="progress-fill" style="width: ${percentVote}%;"></div>
              </div>
            </div>

            <button class="btn btn-primary btn-vote" data-candidate-id="${c.memberId}" style="width: 100%;">
              🗳️ Bình chọn cho ứng viên này
            </button>
          </div>
        `;
      }).join("");

      // Gán sự kiện vote
      candidatesGridEl.querySelectorAll(".btn-vote").forEach(btn => {
        btn.addEventListener("click", () => {
          const cId = btn.getAttribute("data-candidate-id");
          handleVoteCandidate(cId);
        });
      });
    }

    // Lắng nghe tìm kiếm thành viên
    const searchMemberInput = document.getElementById("searchMemberInput");
    if (searchMemberInput) {
      searchMemberInput.oninput = (e) => {
        currentMemberSearchQuery = e.target.value.trim();
        renderMembersAndElection();
      };
    }
  }

  function handleVoteCandidate(candidateId) {
    if (isGuest()) {
      showToast("Vui lòng đăng nhập tài khoản để bình chọn Trưởng Nhóm!", "warning");
      openAuthModal("login");
      return;
    }

    const candidate = appState.election.candidates.find(c => c.memberId === candidateId);
    if (!candidate) return;

    candidate.votes += 1;
    appState.election.totalVotes += 1;

    // Tìm ứng viên có số phiếu cao nhất hiện tại
    let topCandidate = appState.election.candidates[0];
    appState.election.candidates.forEach(c => {
      if (c.votes > topCandidate.votes) {
        topCandidate = c;
      }
    });

    // Tự động gán chức danh Nhóm trưởng cho người dẫn đầu
    appState.members.forEach(m => {
      if (m.id === topCandidate.memberId) {
        m.role = "Nhóm trưởng";
        appState.currentGroup.leaderId = m.id;
      } else {
        m.role = "Thành viên";
      }
    });

    // Nếu người dùng hiện tại chính là người được bầu làm nhóm trưởng
    if (appState.currentUser && appState.currentUser.id === topCandidate.memberId) {
      appState.currentUser.role = "Nhóm trưởng";
    }

    saveState();
    renderMembersAndElection();
    renderUserUI();
    showToast(`Đã ghi nhận 1 phiếu bầu cho ${candidate.name}!`, "success");
  }

  // ==========================================================================
  // MODULE 4 & 5: NHIỆM VỤ & PHÂN CÔNG (TASKS)
  // ==========================================================================
  function renderTasksModule() {
    const filterButtons = document.querySelectorAll(".filter-tab-btn");
    const searchTaskInput = document.getElementById("searchTaskInput");
    const taskCountAll = document.getElementById("taskCountAll");

    if (taskCountAll) {
      taskCountAll.textContent = appState.tasks.length;
    }

    filterButtons.forEach(btn => {
      btn.onclick = () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTaskFilter = btn.getAttribute("data-filter");
        renderTasksTable();
      };
    });

    if (searchTaskInput) {
      searchTaskInput.oninput = (e) => {
        currentTaskSearchQuery = e.target.value.trim().toLowerCase();
        renderTasksTable();
      };
    }

    renderTasksTable();
  }

  function renderTasksTable() {
    const tableBody = document.getElementById("tasksTableBody");
    if (!tableBody) return;

    let filtered = appState.tasks;

    // Lọc theo tab
    if (currentTaskFilter === "todo") {
      filtered = filtered.filter(t => t.status === "todo");
    } else if (currentTaskFilter === "in_progress") {
      filtered = filtered.filter(t => t.status === "in_progress");
    } else if (currentTaskFilter === "done") {
      filtered = filtered.filter(t => t.status === "done");
    }

    // Lọc theo từ khóa tìm kiếm
    if (currentTaskSearchQuery) {
      filtered = filtered.filter(t => 
        t.code.toLowerCase().includes(currentTaskSearchQuery) ||
        t.title.toLowerCase().includes(currentTaskSearchQuery) ||
        t.description.toLowerCase().includes(currentTaskSearchQuery) ||
        (t.assigneeName && t.assigneeName.toLowerCase().includes(currentTaskSearchQuery))
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Không có nhiệm vụ nào phù hợp với bộ lọc hiện tại.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(task => {
      let statusBadge = `<span class="badge badge-neutral">Chưa nhận</span>`;
      if (task.status === "in_progress") statusBadge = `<span class="badge badge-warning">Đang làm</span>`;
      if (task.status === "done") statusBadge = `<span class="badge badge-success">Đã hoàn thành</span>`;

      let priorityClass = "priority-trungbinh";
      if (task.priority === "Cao") priorityClass = "priority-cao";
      if (task.priority === "Khẩn cấp") priorityClass = "priority-khan-cap";

      const isUnassigned = task.status === "todo" || !task.assigneeId;

      return `
        <tr>
          <td style="font-weight: 700; color: var(--color-primary);">${task.code}</td>
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${escapeHTML(task.title)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${escapeHTML(task.description.substring(0, 85))}...</div>
          </td>
          <td>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
          </td>
          <td>
            <div style="font-size: 0.85rem; white-space: nowrap;">📅 ${task.deadline}</div>
          </td>
          <td>
            ${isUnassigned 
              ? `<span style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;">Chưa ai nhận</span>` 
              : `<div style="display: flex; align-items: center; gap: 0.5rem;">
                   <img src="${escapeHTML(task.assigneeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;">
                   <span style="font-size: 0.85rem; font-weight: 500;">${escapeHTML(task.assigneeName)}</span>
                 </div>`
            }
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: nowrap;">
              ${statusBadge}
              <button class="btn btn-secondary btn-sm btn-view-task" data-task-id="${task.id}" title="Xem chi tiết">
                Chi tiết
              </button>
              <button class="btn btn-secondary btn-sm btn-edit-task" data-task-id="${task.id}" title="Chỉnh sửa nhiệm vụ">
                ✏️ Sửa
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Sự kiện mở modal chi tiết nhiệm vụ
    tableBody.querySelectorAll(".btn-view-task").forEach(btn => {
      btn.onclick = () => {
        const taskId = btn.getAttribute("data-task-id");
        openTaskDetailModal(taskId);
      };
    });

    // Sự kiện mở modal chỉnh sửa nhiệm vụ
    tableBody.querySelectorAll(".btn-edit-task").forEach(btn => {
      btn.onclick = () => {
        const taskId = btn.getAttribute("data-task-id");
        openEditTaskModal(taskId);
      };
    });
  }

  let currentDetailTaskId = null;

  function openTaskDetailModal(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    currentDetailTaskId = taskId;
    const modal = document.getElementById("taskDetailModal");
    document.getElementById("detailTaskTitle").textContent = `${task.code}: ${task.title}`;
    document.getElementById("detailTaskDesc").textContent = task.description;
    document.getElementById("detailTaskDeadline").textContent = task.deadline;
    document.getElementById("detailTaskPriority").textContent = task.priority;
    document.getElementById("detailTaskAssignee").textContent = task.assigneeName || "Chưa có ai nhận";
    
    const noteEl = document.getElementById("detailTaskNote");
    if (noteEl) noteEl.textContent = task.note || "Chưa có ghi chú đính kèm.";

    const claimBtn = document.getElementById("btnClaimTask");
    const unclaimBtn = document.getElementById("btnUnclaimTask");
    const completeBtn = document.getElementById("btnCompleteTask");

    // Xử lý các nút bấm tùy trạng thái
    if (task.status === "todo" || !task.assigneeId) {
      claimBtn.style.display = "inline-flex";
      unclaimBtn.style.display = "none";
      completeBtn.style.display = "none";

      claimBtn.onclick = () => {
        if (isGuest()) {
          showToast("Vui lòng đăng nhập tài khoản để nhận nhiệm vụ!", "warning");
          openAuthModal("login");
          return;
        }
        task.status = "in_progress";
        task.assigneeId = appState.currentUser.id;
        task.assigneeName = appState.currentUser.name;
        task.assigneeAvatar = appState.currentUser.avatar;

        saveState();
        renderTasksTable();
        renderDashboard();
        modal.classList.remove("active");
        showToast(`Bạn đã nhận nhiệm vụ "${task.title}"! Hãy hoàn thành đúng hạn nhé.`, "success");
      };
    } else {
      claimBtn.style.display = "none";

      if (task.status === "in_progress") {
        completeBtn.style.display = "inline-flex";
        unclaimBtn.style.display = "inline-flex";

        completeBtn.onclick = () => {
          task.status = "done";
          saveState();
          renderTasksTable();
          renderDashboard();
          modal.classList.remove("active");
          showToast(`Nhiệm vụ "${task.title}" đã hoàn thành xuất sắc!`, "success");
        };

        unclaimBtn.onclick = () => {
          task.status = "todo";
          task.assigneeId = null;
          task.assigneeName = "Chưa nhận";
          task.assigneeAvatar = "";
          saveState();
          renderTasksTable();
          renderDashboard();
          modal.classList.remove("active");
          showToast(`Đã hủy nhận nhiệm vụ "${task.title}".`, "warning");
        };
      } else {
        completeBtn.style.display = "none";
        unclaimBtn.style.display = "none";
      }
    }

    modal.classList.add("active");
  }

  // ==========================================================================
  // MODULE 6: TRAO ĐỔI & CHAT NHÓM (CHAT INTERACTION & AUTO-REPLY)
  // ==========================================================================
  function renderChatModule() {
    const messagesContainer = document.getElementById("chatMessagesContainer");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const typingBox = document.getElementById("chatTypingBox");
    const btnAttachFile = document.getElementById("btnAttachFile");

    function renderMessages() {
      if (!messagesContainer) return;

      messagesContainer.innerHTML = appState.chatMessages.map(msg => {
        const isMe = appState.currentUser && msg.senderId === appState.currentUser.id;
        return `
          <div class="message-item ${isMe ? 'sent' : ''}">
            <img src="${escapeHTML(msg.avatar)}" alt="${escapeHTML(msg.senderName)}" class="msg-avatar">
            <div>
              <div class="msg-meta">
                <span>${escapeHTML(msg.senderName)} ${isMe ? '(Bạn)' : ''}</span>
                <span>•</span>
                <span>${escapeHTML(msg.timestamp)}</span>
              </div>
              <div class="msg-bubble">
                ${escapeHTML(msg.text)}
                ${msg.attachment ? `
                  <div class="chat-attachment-chip">
                    <span>📎</span>
                    <span><strong>${escapeHTML(msg.attachment.name)}</strong> (${escapeHTML(msg.attachment.size)})</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join("");

      // Cuộn xuống tin nhắn mới nhất
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    renderMessages();

    // Xử lý gửi tin nhắn
    function handleSendMessage(text) {
      if (isGuest()) {
        showToast("Vui lòng đăng nhập tài khoản để gửi tin nhắn trao đổi!", "warning");
        openAuthModal("login");
        return;
      }
      if (!text) return;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} Hôm nay`;

      const newMsg = {
        id: "msg-" + Date.now(),
        senderId: appState.currentUser.id,
        senderName: appState.currentUser.name,
        avatar: appState.currentUser.avatar,
        timestamp: timeStr,
        text: text,
        attachment: null
      };

      appState.chatMessages.push(newMsg);
      saveState();
      renderMessages();

      // Mô phỏng phản hồi tự động từ đồng đội trong nhóm sau 1.2s
      setTimeout(() => {
        if (typingBox) typingBox.style.display = "flex";
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
          if (typingBox) typingBox.style.display = "none";
          // Chọn ngẫu nhiên đồng đội trả lời
          const teammates = appState.members.filter(m => m.id !== appState.currentUser.id);
          const replyMember = teammates.length > 0 ? teammates[Math.floor(Math.random() * teammates.length)] : {
            id: "mem-bot",
            name: "Trần Mai Phương",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
          };

          const responses = [
            "Đã nhận thông tin nhé! Mình đang hoàn thiện phần task của mình đây.",
            "Tuyệt vời quá! Cố gắng bám sát timeline nhé cả nhóm 🔥",
            "Mọi người nhớ kiểm tra kỹ phần responsive trên điện thoại trước khi nộp bản cuối nhé!",
            "Nhất trí nhé! Chiều nay mình sẽ test lại các luồng dữ liệu trên demo.",
            "Mình đã ghi nhận rồi nhé, tài liệu slide mình cũng đang soạn hoàn tất rồi."
          ];
          const randomReply = responses[Math.floor(Math.random() * responses.length)];

          const replyMsg = {
            id: "msg-" + Date.now(),
            senderId: replyMember.id,
            senderName: replyMember.name,
            avatar: replyMember.avatar,
            timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} Hôm nay`,
            text: randomReply,
            attachment: null
          };

          appState.chatMessages.push(replyMsg);
          saveState();
          renderMessages();
        }, 1400);
      }, 800);
    }

    if (chatForm) {
      chatForm.onsubmit = (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
          handleSendMessage(text);
          chatInput.value = "";
        }
      };
    }

    // Gợi ý tin nhắn nhanh (Quick reply buttons)
    document.querySelectorAll(".quick-chat-btn").forEach(btn => {
      btn.onclick = () => {
        const msg = btn.getAttribute("data-msg");
        handleSendMessage(msg);
      };
    });

    if (btnAttachFile) {
      btnAttachFile.onclick = () => {
        showToast("Đã đính kèm tệp mẫu: Tailieu_KienTruc_v1.pdf", "success");
        handleSendMessage("📎 Mình gửi cả nhóm tệp tài liệu kiến trúc tham khảo nhé: Tailieu_KienTruc_v1.pdf");
      };
    }
  }

  // ==========================================================================
  // MODULE 7 & 8: NỘP BÀI & TIMELINE LỊCH SỬ CHỈNH SỬA
  // ==========================================================================
  function renderSubmissionsModule() {
    const timelineContainer = document.getElementById("submissionTimeline");
    const dropzone = document.getElementById("submissionDropzone");
    const fileInput = document.getElementById("submissionFileInput");
    const submitForm = document.getElementById("submissionForm");
    const taskSelect = document.getElementById("submissionTaskSelect");

    // Điền danh sách nhiệm vụ vào Dropdown chọn bài nộp
    if (taskSelect) {
      taskSelect.innerHTML = `<option value="all">-- Toàn bộ đồ án (Bản Báo cáo Tổng thể) --</option>` +
        appState.tasks.map(t => `<option value="${t.id}">${t.code}: ${escapeHTML(t.title)}</option>`).join("");
    }

    function renderTimeline() {
      if (!timelineContainer) return;

      timelineContainer.innerHTML = appState.submissions.map(sub => `
        <div class="timeline-item">
          <div class="timeline-node"></div>
          <div class="timeline-card">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <span class="badge badge-primary" style="font-size: 0.85rem;">Phiên bản ${sub.version}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">🕒 ${sub.timestamp}</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; margin: 0.5rem 0 0.25rem;">${escapeHTML(sub.title)}</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Người nộp: <strong>${escapeHTML(sub.submittedBy)}</strong></div>
            <div style="margin: 0.5rem 0; font-size: 0.85rem; color: var(--text-main); background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: 6px;">
              📝 <em>"${escapeHTML(sub.note)}"</em>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--color-primary); font-weight: 500;">
                <span>📦</span> <span>${escapeHTML(sub.fileName)}</span> (${sub.fileSize})
              </div>
              <span class="badge badge-success">Điểm: ${sub.score}</span>
            </div>

            ${sub.feedback ? `
              <div style="margin-top: 0.5rem; font-size: 0.8rem; background: var(--status-success-bg); border: 1px solid var(--status-success-border); padding: 0.5rem; border-radius: 6px; color: #065F46;">
                💬 <strong>Nhận xét từ Giảng viên:</strong> ${escapeHTML(sub.feedback)}
              </div>
            ` : ''}
          </div>
        </div>
      `).join("");
    }

    renderTimeline();

    // Sự kiện kéo thả file
    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      };
      dropzone.ondragleave = () => dropzone.classList.remove("dragover");
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          updateFileNameUI(fileInput.files[0].name, fileInput.files[0].size);
        }
      };

      fileInput.onchange = () => {
        if (fileInput.files.length) {
          updateFileNameUI(fileInput.files[0].name, fileInput.files[0].size);
        }
      };
    }

    function updateFileNameUI(name, size) {
      const dropText = document.getElementById("dropzoneText");
      const sizeStr = size ? (size / 1024 / 1024).toFixed(1) + " MB" : "15.2 MB";
      if (dropText) {
        dropText.innerHTML = `Đã chọn tệp: <strong style="color: var(--color-primary);">${escapeHTML(name)}</strong> (${sizeStr})`;
      }
    }

    if (submitForm) {
      submitForm.onsubmit = (e) => {
        e.preventDefault();
        if (isGuest()) {
          showToast("Vui lòng đăng nhập tài khoản để nộp bài tập nhóm!", "warning");
          openAuthModal("login");
          return;
        }
        const note = document.getElementById("submissionNote").value.trim();
        const selectedFile = fileInput && fileInput.files.length ? fileInput.files[0].name : "DoAn_BaoCao_Nhom05.zip";
        const selectedTaskId = taskSelect ? taskSelect.value : "all";

        let submissionTitle = "Báo cáo Tiến độ Tổng thể Dự án";
        if (selectedTaskId !== "all") {
          const matchedTask = appState.tasks.find(t => t.id === selectedTaskId);
          if (matchedTask) {
            submissionTitle = `Nộp kết quả nhiệm vụ: ${matchedTask.code} - ${matchedTask.title}`;
            matchedTask.status = "done"; // Tự động đánh dấu hoàn thành task
          }
        }

        const nextVer = `v1.${appState.submissions.length}`;
        const newSub = {
          version: nextVer,
          title: submissionTitle,
          submittedBy: `${appState.currentUser.name} (${appState.currentUser.role})`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          fileUrl: "#",
          fileName: selectedFile,
          fileSize: "16.4 MB",
          note: note || "Nộp bài cập nhật tính năng và responsive giao diện.",
          status: "pending",
          score: "Đang chấm",
          feedback: "Bài nộp đã được hệ thống lưu nhận an toàn, giảng viên sẽ phản hồi sớm."
        };

        appState.submissions.unshift(newSub);
        saveState();
        renderTimeline();
        renderTasksTable();
        renderDashboard();
        submitForm.reset();
        
        const dropText = document.getElementById("dropzoneText");
        if (dropText) dropText.innerHTML = "Kéo thả file bài nộp vào đây hoặc <span style='color: var(--color-primary); font-weight: 600;'>bấm để chọn tệp</span>";
        showToast(`Đã nộp bài thành công phiên bản ${nextVer}!`, "success");
      };
    }
  }

  // ==========================================================================
  // MODULE 10: XUẤT BÁO CÁO TIẾN ĐỘ PDF & EXCEL
  // ==========================================================================
  function renderReportsModule() {
    const btnPdf = document.getElementById("btnExportPDF");
    const btnExcel = document.getElementById("btnExportExcel");
    const memberFilter = document.getElementById("reportMemberFilter");
    const statusFilter = document.getElementById("reportStatusFilter");
    const reportTableBody = document.getElementById("reportTableBody");

    // Điền danh sách thành viên vào bộ lọc
    if (memberFilter && memberFilter.children.length <= 1) {
      memberFilter.innerHTML = `<option value="all">Tất cả thành viên trong nhóm</option>` +
        appState.members.map(m => `<option value="${m.id}">${escapeHTML(m.name)} (${escapeHTML(m.studentId)})</option>`).join("");
    }

    function renderReportTable() {
      if (!reportTableBody) return;

      const selectedMem = memberFilter ? memberFilter.value : "all";
      const selectedStatus = statusFilter ? statusFilter.value : "all";

      let filteredTasks = appState.tasks;

      if (selectedMem !== "all") {
        filteredTasks = filteredTasks.filter(t => t.assigneeId === selectedMem);
      }

      if (selectedStatus !== "all") {
        filteredTasks = filteredTasks.filter(t => t.status === selectedStatus);
      }

      if (filteredTasks.length === 0) {
        reportTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
              Không có dữ liệu báo cáo cho tiêu chí lọc đã chọn.
            </td>
          </tr>
        `;
        return;
      }

      reportTableBody.innerHTML = filteredTasks.map(t => {
        const assignee = appState.members.find(m => m.id === t.assigneeId) || {
          name: t.assigneeName || "Chưa nhận",
          studentId: "---",
          role: "Thành viên"
        };

        let statusBadge = `<span class="badge badge-neutral">Chưa làm</span>`;
        if (t.status === "in_progress") statusBadge = `<span class="badge badge-warning">Đang làm</span>`;
        if (t.status === "done") statusBadge = `<span class="badge badge-success">Đã hoàn thành</span>`;

        return `
          <tr>
            <td><strong>${escapeHTML(assignee.name)}</strong></td>
            <td>${escapeHTML(assignee.studentId)}</td>
            <td><span class="badge ${assignee.role === 'Nhóm trưởng' ? 'badge-primary' : 'badge-neutral'}">${escapeHTML(assignee.role)}</span></td>
            <td><strong>${t.code}</strong>: ${escapeHTML(t.title)}</td>
            <td>📅 ${t.deadline}</td>
            <td>${statusBadge}</td>
          </tr>
        `;
      }).join("");
    }

    renderReportTable();

    if (memberFilter) memberFilter.onchange = renderReportTable;
    if (statusFilter) statusFilter.onchange = renderReportTable;

    if (btnPdf) {
      btnPdf.onclick = () => {
        showToast("Đang chuẩn bị trang in Báo Cáo Tiến Độ Khổ A4...", "success");
        setTimeout(() => {
          window.print();
        }, 500);
      };
    }

    if (btnExcel) {
      btnExcel.onclick = () => {
        showToast("Đang tạo tệp Excel (CSV) có hỗ trợ tiếng Việt...", "warning");
        setTimeout(() => {
          // Thêm BOM \uFEFF để Excel mở tiếng Việt không lỗi font
          let csvContent = "\uFEFFMã CV,Tên Công Việc,Độ Ưu Tiên,Hạn Nộp,Người Phụ Trách,MSSV,Trạng Thái\n";
          appState.tasks.forEach(t => {
            const assignee = appState.members.find(m => m.id === t.assigneeId);
            const stuId = assignee ? assignee.studentId : "---";
            csvContent += `"${t.code}","${t.title}","${t.priority}","${t.deadline}","${t.assigneeName || 'Chưa nhận'}","${stuId}","${t.status}"\n`;
          });

          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `BaoCao_TienDo_Nhom05_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast("Đã xuất tệp Excel thành công!", "success");
        }, 400);
      };
    }
  }

  // ==========================================================================
  // KHỞI TẠO CÁC MODAL BỔ TRỢ (TẠO NHIỆM VỤ, ỨNG CỬ, TẠO NHÓM)
  // ==========================================================================
  function initModals() {
    // 1. Modal Tạo Nhiệm Vụ Mới
    const createTaskModal = document.getElementById("createTaskModal");
    const openCreateTaskBtn = document.getElementById("btnOpenCreateTask");
    const closeCreateTaskBtn = document.getElementById("btnCloseCreateTask");
    const createTaskForm = document.getElementById("createTaskForm");

    if (openCreateTaskBtn) openCreateTaskBtn.onclick = () => createTaskModal.classList.add("active");
    if (closeCreateTaskBtn) closeCreateTaskBtn.onclick = () => createTaskModal.classList.remove("active");

    if (createTaskForm) {
      createTaskForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById("newTaskTitle").value.trim();
        const desc = document.getElementById("newTaskDesc").value.trim();
        const deadline = document.getElementById("newTaskDeadline").value;
        const priority = document.getElementById("newTaskPriority").value;

        if (!title || !desc || !deadline) {
          showToast("Vui lòng điền đầy đủ thông tin nhiệm vụ!", "warning");
          return;
        }

        const nextNum = appState.tasks.length + 1;
        const taskCode = `TASK-${nextNum.toString().padStart(2, '0')}`;

        const newTask = {
          id: "task-" + Date.now(),
          code: taskCode,
          title: title,
          description: desc,
          deadline: deadline,
          priority: priority,
          status: "todo",
          assigneeId: null,
          assigneeName: "Chưa nhận",
          assigneeAvatar: "",
          attachments: [],
          note: "Nhiệm vụ mới tạo."
        };

        appState.tasks.push(newTask);
        saveState();
        renderTasksTable();
        renderDashboard();
        createTaskForm.reset();
        createTaskModal.classList.remove("active");
        showToast(`Đã thêm nhiệm vụ ${taskCode}: ${title}!`, "success");
      };
    }

    // 2. Modal Ứng Cử Nhóm Trưởng
    const nominateModal = document.getElementById("nominateModal");
    const openNominateBtn = document.getElementById("btnOpenNominate");
    const closeNominateBtn = document.getElementById("btnCloseNominate");
    const nominateForm = document.getElementById("nominateForm");

    if (openNominateBtn) openNominateBtn.onclick = () => nominateModal.classList.add("active");
    if (closeNominateBtn) closeNominateBtn.onclick = () => nominateModal.classList.remove("active");

    if (nominateForm) {
      nominateForm.onsubmit = (e) => {
        e.preventDefault();
        if (isGuest()) {
          showToast("Vui lòng đăng nhập tài khoản để ứng cử Trưởng Nhóm!", "warning");
          openAuthModal("login");
          return;
        }
        const slogan = document.getElementById("nominateSlogan").value.trim();
        const exp = document.getElementById("nominateExperience").value.trim();

        if (!slogan) {
          showToast("Vui lòng nhập khẩu hiệu tranh cử!", "warning");
          return;
        }

        const existingCandidate = appState.election.candidates.find(c => c.memberId === appState.currentUser.id);

        if (existingCandidate) {
          existingCandidate.slogan = slogan;
          existingCandidate.experience = exp;
          showToast("Đã cập nhật khẩu hiệu tranh cử của bạn!", "success");
        } else {
          appState.election.candidates.push({
            memberId: appState.currentUser.id,
            name: appState.currentUser.name,
            slogan: slogan,
            experience: exp || "Sẵn sàng cống hiến hết mình vì kết quả cao của nhóm.",
            votes: 0,
            isLeading: false
          });
          showToast(`Chúc mừng ${appState.currentUser.name} đã tham gia ứng cử Trưởng Nhóm!`, "success");
        }

        saveState();
        renderMembersAndElection();
        nominateForm.reset();
        nominateModal.classList.remove("active");
      };
    }

    // 3. Modal Tạo / Đổi Nhóm
    const createGroupModal = document.getElementById("createGroupModal");
    const openCreateGroupBtn = document.getElementById("btnOpenCreateGroup");
    const closeCreateGroupBtn = document.getElementById("btnCloseCreateGroup");
    const createGroupForm = document.getElementById("createGroupForm");

    if (openCreateGroupBtn) openCreateGroupBtn.onclick = () => createGroupModal.classList.add("active");
    if (closeCreateGroupBtn) closeCreateGroupBtn.onclick = () => createGroupModal.classList.remove("active");

    if (createGroupForm) {
      createGroupForm.onsubmit = (e) => {
        e.preventDefault();
        const gName = document.getElementById("newGroupName").value.trim();
        const gCode = document.getElementById("newGroupCode").value.trim();
        const gTopic = document.getElementById("newGroupTopic").value.trim();

        if (gName && gCode) {
          appState.currentGroup.name = gName;
          appState.currentGroup.code = gCode;
          appState.currentGroup.topic = gTopic;

          document.querySelectorAll(".group-code").forEach(el => el.textContent = gCode);
          document.querySelectorAll(".group-name").forEach(el => el.textContent = gName);

          saveState();
          renderMembersAndElection();
          createGroupModal.classList.remove("active");
          showToast("Đã cập nhật thông tin nhóm thành công!", "success");
        }
      };
    }

    // 4. Form Thêm Thành Viên Mới
    const addMemberForm = document.getElementById("addMemberForm");
    if (addMemberForm) {
      addMemberForm.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("addMemberName");
        const emailInput = document.getElementById("addMemberEmail");
        const stuInput = document.getElementById("addMemberStudentId");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const stuId = stuInput ? stuInput.value.trim() : "";

        if (!email) {
          showToast("Vui lòng nhập Email sinh viên!", "warning");
          return;
        }

        const newMem = {
          id: "mem-" + Date.now(),
          name: name || email.split("@")[0].toUpperCase(),
          studentId: stuId || "2021" + Math.floor(1000 + Math.random() * 9000),
          email: email,
          role: "Thành viên",
          skills: ["Thành viên mới", "Cộng tác"],
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          status: "online",
          tasksCompleted: 0,
          tasksActive: 0,
          votes: 0
        };

        appState.members.push(newMem);
        saveState();
        renderMembersAndElection();
        renderDashboard();
        renderReportsModule();
        addMemberForm.reset();
        showToast(`Đã thêm thành viên ${newMem.name} vào nhóm thành công!`, "success");
      };
    }

    // 5. Modal Chi Tiết Nhiệm Vụ Đóng
    const closeTaskDetailBtn = document.getElementById("btnCloseTaskDetail");
    const taskDetailModal = document.getElementById("taskDetailModal");
    if (closeTaskDetailBtn && taskDetailModal) {
      closeTaskDetailBtn.onclick = () => taskDetailModal.classList.remove("active");
    }

    // 6. Modal Chỉnh Sửa Thông Tin Thành Viên
    const editMemberModal = document.getElementById("editMemberModal");
    const closeEditMemberBtn = document.getElementById("btnCloseEditMember");
    const cancelEditMemberBtn = document.getElementById("btnCancelEditMember");
    const editMemberForm = document.getElementById("editMemberForm");
    const editMemberAvatarInput = document.getElementById("editMemberAvatar");
    const editMemberAvatarPreview = document.getElementById("editMemberAvatarPreview");
    const btnDeleteMemberFromModal = document.getElementById("btnDeleteMemberFromModal");

    if (closeEditMemberBtn) closeEditMemberBtn.onclick = () => editMemberModal.classList.remove("active");
    if (cancelEditMemberBtn) cancelEditMemberBtn.onclick = () => editMemberModal.classList.remove("active");

    if (editMemberAvatarInput && editMemberAvatarPreview) {
      editMemberAvatarInput.oninput = (e) => {
        const val = e.target.value.trim();
        if (val) {
          editMemberAvatarPreview.src = val;
        }
      };
    }

    if (editMemberForm) {
      editMemberForm.onsubmit = (e) => {
        e.preventDefault();
        const mId = document.getElementById("editMemberId").value;
        const name = document.getElementById("editMemberName").value.trim();
        const stuId = document.getElementById("editMemberStudentId").value.trim();
        const email = document.getElementById("editMemberEmail").value.trim();
        const role = document.getElementById("editMemberRole").value;
        const status = document.getElementById("editMemberStatus").value;
        const skillsRaw = document.getElementById("editMemberSkills").value.trim();
        const avatar = document.getElementById("editMemberAvatar").value.trim();

        if (!name || !email || !stuId) {
          showToast("Vui lòng điền đầy đủ Họ tên, MSSV và Email!", "warning");
          return;
        }

        const member = appState.members.find(m => m.id === mId);
        if (!member) return;

        // Parse skills
        const skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : member.skills;

        member.name = name;
        member.studentId = stuId;
        member.email = email;
        member.role = role;
        member.status = status;
        member.skills = skills.length ? skills : ["Chuyên môn"];
        if (avatar) member.avatar = avatar;

        // Nếu thành viên được chỉnh sửa là người dùng đang đăng nhập
        if (appState.currentUser && appState.currentUser.id === mId) {
          appState.currentUser.name = name;
          appState.currentUser.studentId = stuId;
          appState.currentUser.email = email;
          appState.currentUser.role = role;
          if (avatar) appState.currentUser.avatar = avatar;
          renderUserUI();
        }

        // Cập nhật tên và avatar trong các nhiệm vụ đã giao cho thành viên này
        appState.tasks.forEach(t => {
          if (t.assigneeId === mId) {
            t.assigneeName = name;
            if (avatar) t.assigneeAvatar = avatar;
          }
        });

        // Cập nhật tên ứng viên nếu người này đang tham gia bầu cử
        const candidate = appState.election.candidates.find(c => c.memberId === mId);
        if (candidate) {
          candidate.name = name;
        }

        // Nếu đổi vai trò thành "Nhóm trưởng"
        if (role === "Nhóm trưởng") {
          appState.currentGroup.leaderId = mId;
        }

        saveState();
        renderAllModules();
        editMemberModal.classList.remove("active");
        showToast(`Đã cập nhật thông tin thành viên "${name}" thành công!`, "success");
      };
    }

    if (btnDeleteMemberFromModal) {
      btnDeleteMemberFromModal.onclick = () => {
        const mId = document.getElementById("editMemberId").value;
        const member = appState.members.find(m => m.id === mId);
        if (!member) return;

        if (appState.members.length <= 1) {
          showToast("Nhóm phải có tối thiểu 1 thành viên!", "warning");
          return;
        }

        // Xóa khỏi danh sách thành viên
        appState.members = appState.members.filter(m => m.id !== mId);

        // Hủy nhận việc của các task thuộc thành viên bị xóa
        appState.tasks.forEach(t => {
          if (t.assigneeId === mId) {
            t.assigneeId = null;
            t.assigneeName = "Chưa nhận";
            t.assigneeAvatar = "";
            t.status = "todo";
          }
        });

        // Xóa khỏi danh sách ứng viên bầu cử nếu có
        appState.election.candidates = appState.election.candidates.filter(c => c.memberId !== mId);

        // Nếu thành viên bị xóa là currentUser thì chuyển sang người đầu tiên
        if (appState.currentUser && appState.currentUser.id === mId) {
          appState.currentUser = { ...appState.members[0] };
          renderUserUI();
        }

        saveState();
        renderAllModules();
        editMemberModal.classList.remove("active");
        showToast(`Đã xóa thành viên "${member.name}" khỏi nhóm.`, "warning");
      };
    }

    // 7. Modal Chỉnh Sửa Nhiệm Vụ (Edit Task)
    const editTaskModal = document.getElementById("editTaskModal");
    const closeEditTaskBtn = document.getElementById("btnCloseEditTask");
    const cancelEditTaskBtn = document.getElementById("btnCancelEditTask");
    const editTaskForm = document.getElementById("editTaskForm");
    const btnDeleteTaskFromModal = document.getElementById("btnDeleteTaskFromModal");
    const btnEditTaskFromDetail = document.getElementById("btnEditTaskFromDetail");

    if (closeEditTaskBtn) closeEditTaskBtn.onclick = () => editTaskModal.classList.remove("active");
    if (cancelEditTaskBtn) cancelEditTaskBtn.onclick = () => editTaskModal.classList.remove("active");

    if (btnEditTaskFromDetail) {
      btnEditTaskFromDetail.onclick = () => {
        const detailModal = document.getElementById("taskDetailModal");
        if (detailModal) detailModal.classList.remove("active");
        if (currentDetailTaskId) {
          openEditTaskModal(currentDetailTaskId);
        }
      };
    }

    if (editTaskForm) {
      editTaskForm.onsubmit = (e) => {
        e.preventDefault();
        if (isGuest()) {
          showToast("Vui lòng đăng nhập để lưu thay đổi!", "warning");
          openAuthModal("login");
          return;
        }

        const tId = document.getElementById("editTaskId").value;
        const title = document.getElementById("editTaskTitle").value.trim();
        const desc = document.getElementById("editTaskDesc").value.trim();
        const deadline = document.getElementById("editTaskDeadline").value;
        const priority = document.getElementById("editTaskPriority").value;
        const status = document.getElementById("editTaskStatus").value;
        const assigneeId = document.getElementById("editTaskAssignee").value;
        const note = document.getElementById("editTaskNote").value.trim();

        if (!title || !desc || !deadline) {
          showToast("Vui lòng điền đầy đủ Tiêu đề, Mô tả và Hạn chót!", "warning");
          return;
        }

        const task = appState.tasks.find(t => t.id === tId);
        if (!task) return;

        task.title = title;
        task.description = desc;
        task.deadline = deadline;
        task.priority = priority;
        task.status = status;
        task.note = note || "";

        // Cập nhật người phụ trách
        if (assigneeId) {
          const member = appState.members.find(m => m.id === assigneeId);
          if (member) {
            task.assigneeId = member.id;
            task.assigneeName = member.name;
            task.assigneeAvatar = member.avatar;
            if (task.status === "todo") {
              task.status = "in_progress";
            }
          }
        } else {
          task.assigneeId = null;
          task.assigneeName = "Chưa nhận";
          task.assigneeAvatar = "";
          if (task.status !== "done") {
            task.status = "todo";
          }
        }

        saveState();
        renderAllModules();
        editTaskModal.classList.remove("active");
        showToast(`Đã cập nhật nhiệm vụ ${task.code}: "${title}" thành công!`, "success");
      };
    }

    if (btnDeleteTaskFromModal) {
      btnDeleteTaskFromModal.onclick = () => {
        if (isGuest()) {
          showToast("Vui lòng đăng nhập để thực hiện!", "warning");
          openAuthModal("login");
          return;
        }

        const tId = document.getElementById("editTaskId").value;
        const task = appState.tasks.find(t => t.id === tId);
        if (!task) return;

        // Xóa task khỏi danh sách
        appState.tasks = appState.tasks.filter(t => t.id !== tId);

        saveState();
        renderAllModules();
        editTaskModal.classList.remove("active");
        showToast(`Đã xóa nhiệm vụ ${task.code}: "${task.title}" khỏi danh sách.`, "warning");
      };
    }
  }

  function openEditTaskModal(taskId) {
    if (isGuest()) {
      showToast("Vui lòng đăng nhập tài khoản để chỉnh sửa nhiệm vụ!", "warning");
      openAuthModal("login");
      return;
    }

    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById("editTaskModal");
    const idInput = document.getElementById("editTaskId");
    const codeInput = document.getElementById("editTaskCode");
    const titleInput = document.getElementById("editTaskTitle");
    const descInput = document.getElementById("editTaskDesc");
    const deadlineInput = document.getElementById("editTaskDeadline");
    const prioritySelect = document.getElementById("editTaskPriority");
    const statusSelect = document.getElementById("editTaskStatus");
    const assigneeSelect = document.getElementById("editTaskAssignee");
    const noteInput = document.getElementById("editTaskNote");

    if (idInput) idInput.value = task.id;
    if (codeInput) codeInput.value = task.code;
    if (titleInput) titleInput.value = task.title;
    if (descInput) descInput.value = task.description;
    if (deadlineInput) deadlineInput.value = task.deadline;
    if (prioritySelect) prioritySelect.value = task.priority;
    if (statusSelect) statusSelect.value = task.status;
    if (noteInput) noteInput.value = task.note || "";

    // Nạp danh sách thành viên vào dropdown người phụ trách
    if (assigneeSelect) {
      assigneeSelect.innerHTML = `
        <option value="">-- Chưa phân công (Chưa nhận) --</option>
        ${appState.members.map(m => `
          <option value="${m.id}" ${task.assigneeId === m.id ? 'selected' : ''}>
            ${escapeHTML(m.name)} (${escapeHTML(m.role)})
          </option>
        `).join("")}
      `;
    }

    modal.classList.add("active");
  }

  function openEditMemberModal(memberId) {
    const member = appState.members.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById("editMemberModal");
    const idInput = document.getElementById("editMemberId");
    const nameInput = document.getElementById("editMemberName");
    const stuInput = document.getElementById("editMemberStudentId");
    const emailInput = document.getElementById("editMemberEmail");
    const roleSelect = document.getElementById("editMemberRole");
    const statusSelect = document.getElementById("editMemberStatus");
    const skillsInput = document.getElementById("editMemberSkills");
    const avatarInput = document.getElementById("editMemberAvatar");
    const avatarPreview = document.getElementById("editMemberAvatarPreview");

    if (idInput) idInput.value = member.id;
    if (nameInput) nameInput.value = member.name;
    if (stuInput) stuInput.value = member.studentId;
    if (emailInput) emailInput.value = member.email;
    if (roleSelect) roleSelect.value = member.role;
    if (statusSelect) statusSelect.value = member.status;
    if (skillsInput) skillsInput.value = (member.skills || []).join(", ");
    if (avatarInput) avatarInput.value = member.avatar || "";
    if (avatarPreview) avatarPreview.src = member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

    modal.classList.add("active");
  }

  // Đóng modal khi bấm ra ngoài backdrop hoặc bấm phím Escape
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(m => m.classList.remove("active"));
    }
  });
});

