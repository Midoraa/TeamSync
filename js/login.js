/**
 * LOGIN.JS - LOGIC XÁC THỰC & ĐIỀU HƯỚNG TRANG ĐĂNG NHẬP
 * Nền tảng Hỗ trợ Bài Tập Nhóm TeamSync (Frontend HTML/CSS/JS)
 */

(function () {
  "use strict";

  // Biến trạng thái
  let appState = null;

  // Tiện ích escape chuỗi an toàn
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Tiện ích hiển thị Toast thông báo trên login page
  function showToast(message, type = "success") {
    const container = document.getElementById("loginToastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `login-toast toast-${type}`;

    let icon = "✓";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "✕";

    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 1.1rem;">${icon}</span>
      <div style="flex: 1; font-size: 0.875rem; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "all 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Khởi tạo và đồng bộ App State từ LocalStorage hoặc MockData
  function initAppState() {
    const saved = localStorage.getItem("TAM_APP_STATE");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.members && parsed.tasks) {
          return parsed;
        }
      } catch (e) {
        console.error("Lỗi khi đọc LocalStorage, khôi phục mockData:", e);
      }
    }
    // Dữ liệu ban đầu từ window.mockData
    const initialState = JSON.parse(JSON.stringify(window.mockData || {}));
    saveState(initialState);
    return initialState;
  }

  function saveState(state = appState) {
    localStorage.setItem("TAM_APP_STATE", JSON.stringify(state));
  }

  // Thực hiện đăng nhập cho người dùng
  function performLogin(user, sourceBtn = null) {
    if (!user) return;

    // Hiển thị trạng thái đang xử lý nếu có nút kích hoạt
    if (sourceBtn) {
      sourceBtn.disabled = true;
      const originalText = sourceBtn.innerHTML;
      sourceBtn.innerHTML = `⏳ Đang đăng nhập...`;
      setTimeout(() => {
        sourceBtn.innerHTML = originalText;
        sourceBtn.disabled = false;
      }, 2000);
    }

    // Cập nhật người dùng hiện tại
    appState.currentUser = { ...user };
    saveState();

    showToast(`Đăng nhập thành công! Chào mừng <strong>${escapeHTML(user.name)}</strong> 👋`, "success");

    // Chuyển hướng sang trang index.html
    setTimeout(() => {
      window.location.href = "index.html";
    }, 400);
  }

  // Đăng xuất khỏi tài khoản đang lưu
  function performLogout() {
    appState.currentUser = {
      id: "guest",
      name: "Khách (Chưa đăng nhập)",
      studentId: "---",
      email: "guest@edu.vn",
      role: "Khách",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      status: "offline"
    };
    saveState();

    const banner = document.getElementById("activeSessionBanner");
    if (banner) banner.style.display = "none";

    showToast("Bạn đã đăng xuất tài khoản thành công.", "warning");
  }

  // Chuyển đổi giữa các tab: Đăng nhập, Chọn nhanh, Đăng ký
  function switchTab(targetTab) {
    const tabs = {
      login: document.getElementById("tabLogin"),
      demo: document.getElementById("tabDemo"),
      register: document.getElementById("tabRegister")
    };

    const panels = {
      login: document.getElementById("panelLogin"),
      demo: document.getElementById("panelDemo"),
      register: document.getElementById("panelRegister")
    };

    Object.entries(tabs).forEach(([key, btn]) => {
      if (btn) btn.classList.toggle("active", key === targetTab);
    });

    Object.entries(panels).forEach(([key, panel]) => {
      if (panel) panel.style.display = key === targetTab ? "block" : "none";
    });
  }

  // Render danh sách nút đăng nhập nhanh 1-chạm
  function renderQuickPills() {
    const container = document.getElementById("quickLoginPillsList");
    if (!container || !appState.members) return;

    container.innerHTML = appState.members.map(m => {
      const shortName = m.name.split(" ").pop();
      const isLeader = m.role === "Nhóm trưởng";
      return `
        <button type="button" class="quick-member-pill" data-user-id="${m.id}" title="${escapeHTML(m.name)} (${escapeHTML(m.role)})">
          <img src="${escapeHTML(m.avatar)}" alt="${escapeHTML(m.name)}">
          <span>${escapeHTML(shortName)}</span>
          ${isLeader ? `<span class="pill-badge">Trưởng nhóm</span>` : ""}
        </button>
      `;
    }).join("");

    container.querySelectorAll(".quick-member-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-user-id");
        const found = appState.members.find(m => m.id === userId);
        if (found) performLogin(found, btn);
      });
    });
  }

  // Render danh sách thẻ thành viên Demo chi tiết
  function renderDemoCards() {
    const container = document.getElementById("demoMembersGrid");
    if (!container || !appState.members) return;

    container.innerHTML = appState.members.map(m => {
      const isLeader = m.role === "Nhóm trưởng";
      const isOnline = m.status === "online";
      return `
        <div class="demo-member-card" data-user-id="${m.id}">
          <div class="demo-member-left">
            <div style="position: relative;">
              <img class="demo-member-avatar" src="${escapeHTML(m.avatar)}" alt="${escapeHTML(m.name)}">
              <span class="status-dot-pulse" style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border: 2px solid #FFFFFF;"></span>
            </div>
            <div class="demo-member-info">
              <h4>${escapeHTML(m.name)} ${isLeader ? `<span style="font-size: 0.7rem; background: #EFF6FF; color: #2563EB; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Nhóm trưởng</span>` : ""}</h4>
              <div class="demo-member-meta">
                <span>MSSV: <strong>${escapeHTML(m.studentId)}</strong></span>
                <span>•</span>
                <span>${escapeHTML(m.email)}</span>
              </div>
            </div>
          </div>
          <button type="button" class="btn-demo-login">Đăng Nhập ➔</button>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".demo-member-card").forEach(card => {
      card.addEventListener("click", () => {
        const userId = card.getAttribute("data-user-id");
        const found = appState.members.find(m => m.id === userId);
        if (found) performLogin(found);
      });
    });
  }

  // Render avatar stack trên Hero card
  function renderHeroAvatarStack() {
    const stack = document.getElementById("heroAvatarStack");
    if (!stack || !appState.members) return;

    stack.innerHTML = appState.members.slice(0, 5).map(m => `
      <img class="avatar-stack-item" src="${escapeHTML(m.avatar)}" alt="${escapeHTML(m.name)}" title="${escapeHTML(m.name)}">
    `).join("");
  }

  // Khởi tạo các sự kiện khi DOM sẵn sàng
  document.addEventListener("DOMContentLoaded", () => {
    appState = initAppState();

    renderHeroAvatarStack();
    renderQuickPills();
    renderDemoCards();

    // 1. Kiểm tra tham số đăng xuất từ URL (?logout=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("logout") === "true") {
      performLogout();
      // Làm sạch URL mà không reload trang
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // 2. Kiểm tra nếu đã có phiên đăng nhập hợp lệ
      if (appState.currentUser && appState.currentUser.id && appState.currentUser.id !== "guest") {
        const banner = document.getElementById("activeSessionBanner");
        const avatar = document.getElementById("activeSessionAvatar");
        const name = document.getElementById("activeSessionName");
        const role = document.getElementById("activeSessionRole");

        if (banner) banner.style.display = "flex";
        if (avatar) avatar.src = appState.currentUser.avatar || "";
        if (name) name.textContent = appState.currentUser.name;
        if (role) role.textContent = `${appState.currentUser.role} • ${appState.currentUser.studentId}`;
      }
    }

    // 3. Tab Buttons
    const tabLogin = document.getElementById("tabLogin");
    const tabDemo = document.getElementById("tabDemo");
    const tabRegister = document.getElementById("tabRegister");

    if (tabLogin) tabLogin.addEventListener("click", () => switchTab("login"));
    if (tabDemo) tabDemo.addEventListener("click", () => switchTab("demo"));
    if (tabRegister) tabRegister.addEventListener("click", () => switchTab("register"));

    // Hỗ trợ mở sẵn tab theo hash URL (#register hoặc #demo)
    if (window.location.hash === "#register") {
      switchTab("register");
    } else if (window.location.hash === "#demo") {
      switchTab("demo");
    }

    // 4. Form Đăng Nhập
    const loginForm = document.getElementById("mainLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const queryInput = document.getElementById("loginQuery");
        const pwInput = document.getElementById("loginPassword");
        const submitBtn = document.getElementById("btnLoginSubmit");

        const query = (queryInput?.value || "").trim().toLowerCase();
        const password = pwInput?.value || "";

        if (!query) {
          showToast("Vui lòng nhập Email hoặc MSSV sinh viên!", "warning");
          queryInput?.focus();
          return;
        }

        if (password.length < 6) {
          showToast("Mật khẩu cần tối thiểu 6 ký tự!", "warning");
          pwInput?.focus();
          return;
        }

        // Tìm kiếm trong danh sách thành viên
        const member = appState.members.find(m =>
          m.email.toLowerCase() === query ||
          m.studentId.toLowerCase() === query
        );

        if (member) {
          performLogin(member, submitBtn);
        } else {
          showToast("Không tìm thấy tài khoản! Vui lòng kiểm tra lại hoặc sử dụng tính năng 'Chọn Nhanh Demo'.", "danger");
        }
      });
    }

    // 5. Form Đăng Ký
    const registerForm = document.getElementById("mainRegisterForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("regName");
        const studentIdInput = document.getElementById("regStudentId");
        const emailInput = document.getElementById("regEmail");
        const pwInput = document.getElementById("regPassword");
        const pwConfirmInput = document.getElementById("regPasswordConfirm");
        const submitBtn = document.getElementById("btnRegisterSubmit");

        const name = (nameInput?.value || "").trim();
        const studentId = (studentIdInput?.value || "").trim();
        const email = (emailInput?.value || "").trim().toLowerCase();
        const password = pwInput?.value || "";
        const passwordConfirm = pwConfirmInput?.value || "";

        if (!name) { showToast("Vui lòng nhập họ và tên đầy đủ!", "warning"); return; }
        if (!studentId) { showToast("Vui lòng nhập Mã số sinh viên (MSSV)!", "warning"); return; }
        if (!email) { showToast("Vui lòng nhập Email sinh viên!", "warning"); return; }
        if (password.length < 6) { showToast("Mật khẩu cần tối thiểu 6 ký tự!", "warning"); return; }
        if (password !== passwordConfirm) { showToast("Mật khẩu xác nhận không khớp!", "danger"); return; }

        // Kiểm tra tài khoản trùng lặp
        const existing = appState.members.find(m =>
          m.email.toLowerCase() === email ||
          m.studentId.toLowerCase() === studentId.toLowerCase()
        );

        if (existing) {
          showToast("Email hoặc MSSV này đã tồn tại trong nhóm! Bạn có thể đăng nhập ngay.", "warning");
          switchTab("login");
          if (document.getElementById("loginQuery")) {
            document.getElementById("loginQuery").value = email;
          }
          return;
        }

        // Tạo thành viên mới
        const newMember = {
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

        appState.members.push(newMember);
        performLogin(newMember, submitBtn);
      });
    }

    // 6. Nút Hiện / Ẩn Mật khẩu (Eye Toggle)
    document.querySelectorAll(".btn-toggle-eye").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const input = document.getElementById(targetId);
        if (input) {
          const isHidden = input.type === "password";
          input.type = isHidden ? "text" : "password";
          btn.textContent = isHidden ? "🙈" : "👁";
        }
      });
    });

    // 7. Nút trong Active Session Banner
    const btnEnterApp = document.getElementById("btnActiveSessionEnter");
    const btnLogoutSession = document.getElementById("btnActiveSessionLogout");

    if (btnEnterApp) {
      btnEnterApp.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    if (btnLogoutSession) {
      btnLogoutSession.addEventListener("click", () => {
        performLogout();
      });
    }

    // 8. Quên mật khẩu demo toast
    const forgotPwLink = document.getElementById("forgotPasswordLink");
    if (forgotPwLink) {
      forgotPwLink.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Mẹo: Mật khẩu demo là <code>123456</code> (hoặc bất kỳ mật khẩu >= 6 ký tự). Bạn cũng có thể dùng nút ⚡ Chọn Nhanh bên dưới!", "warning");
      });
    }
  });
})();
