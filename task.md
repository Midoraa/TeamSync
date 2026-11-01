# Antigravity Tasklist: Website Làm Bài Tập Nhóm (HTML/CSS/JS)

## 🎨 QUY TẮC PHONG CÁCH GIAO DIỆN (STRICT DESIGN SYSTEM RULES)
> AI Agent BẮT BUỘC tuân thủ các quy tắc thiết kế này cho TẤT CẢ các component để đảm bảo đồng bộ 1 style duy nhất:
- **Design Style:** Modern Clean Dashboard, bo tròn góc nhẹ (`border-radius: 8px` - `12px`), đổ bóng nhẹ (`box-shadow: 0 2px 8px rgba(0,0,0,0.05)`).
- **Bảng màu chủ đạo (Color Palette):**
  - Primary (Xanh dương chính): `#1E61F0` hoặc `#2563EB`
  - Primary Hover: `#1D4ED8`
  - Background tổng thể: `#F3F4F6` (Xám nhạt)
  - Card/Container Background: `#FFFFFF` (Trắng)
  - Text chính: `#1F2937`, Text phụ: `#6B7280`
  - Status colors: Success `#10B981` (Đã xong), Warning `#F59E0B` (Đang làm), Neutral `#9CA3AF` (Chưa làm).
- **Typography:** Font hệ thống sạch (`Inter`, `Roboto`, hoặc `system-ui, -apple-system, sans-serif`).
- **CSS Standard:** Sử dụng CSS Variables (hoặc Tailwind CSS) để định nghĩa sẵn màu sắc/spacing, tuyệt đối không dùng inline CSS tản mạn.

---

## 📱 QUY TẮC RESPONSIVE (MOBILE & TABLET REQUIREMENTS)
> Mọi giao diện phải đáp ứng Responsive theo tiêu chuẩn Mobile-First hoặc Fluid Adaptive:
- **Breakpoints:**
  - Mobile: `< 768px`
  - Tablet: `768px - 1024px`
  - Desktop: `> 1024px`
- **Hành vi trên Mobile (< 768px):**
  - Sidebar chuyển thành **Overlay Drawer** (ẩn đi và mở ra bằng nút Hamburger menu ☰ ở Header).
  - Tự động chuyển các bố cục Grid 2-3 cột về **1 cột duy nhất (Single Column)**.
  - Khung Chat và Bảng Task tự động điều chỉnh chiều cao, cho phép cuộn dọc/ngang mượt mà (`overflow-x: auto` cho bảng dữ liệu).
  - Các nút bấm (Buttons/Inputs) đảm bảo chiều cao tối thiểu `44px` để dễ thao tác vuốt/chạm trên điện thoại.

---

## 🚀 DANH SÁCH TASKS THỰC HIỆN

### Giai đoạn 1: Khởi tạo Project & Cấu trúc Design System
- [x] **Task 1.1:** Khởi tạo cấu trúc thư mục project
  - Tạo các thư mục: `css/`, `js/`, `assets/images/`, `data/`
  - Tạo các file cơ bản: `index.html`, `css/style.css`, `css/variables.css` (chứa CSS Variables màu sắc/font), `js/main.js`, `data/mockData.js`
- [x] **Task 1.2:** Dựng khung App Layout & Responsive Shell
  - Design thanh **Sidebar** bên trái (Logo, Navigation Menu: Trang chủ, Nhóm, Nhiệm vụ, Nộp bài, Tài liệu, Chat, Tiến độ).
  - Design thanh **Header** phía trên (Nút Hamburger trên Mobile, Thanh tìm kiếm, Thông báo, Profile User).
  - Viết CSS Responsive cơ bản cho Layout (Sidebar ẩn/hiện trên Mobile).

---

### Giai đoạn 2: Phát triển các Module UI & Tính năng Mock JavaScript

- [x] **Task 2.1:** Dựng Module 1 - Đăng ký / Đăng nhập (Responsive Form)
  - Form Đăng nhập & Đăng ký căn giữa màn hình, tự thu gọn vừa vặn màn hình điện thoại.
  - Viết JS quản lý trạng thái đăng nhập mô phỏng bằng `localStorage`.

- [x] **Task 2.2:** Dựng Module 2 - Tạo nhóm & Quản lý thành viên
  - Modal "Tạo nhóm mới" thiết kế chuẩn UI chung, hiển thị full width trên Mobile.
  - Ô tìm kiếm/thêm thành viên theo Email và danh sách thành viên dạng Card/List.

- [x] **Task 2.3:** Dựng Module 3 - Bầu chọn Nhóm trưởng
  - Danh sách ứng viên dạng Card responsive, hiển thị số phiếu và nút bình chọn.
  - Viết JS tính tổng số phiếu, tự động highlight ứng viên có số phiếu cao nhất.

- [x] **Task 2.4:** Dựng Module 4 & 5 - Bảng Phân công & Nhận nhiệm vụ
  - Bảng danh sách nhiệm vụ có tính năng cuộn ngang mượt mà trên Mobile (`overflow-x: auto`).
  - Modal "Chi tiết nhiệm vụ" kèm nút "Nhận nhiệm vụ".
  - Viết JS cập nhật trạng thái nhiệm vụ tương tác trực tiếp.

- [x] **Task 2.5:** Dựng Module 6 - Trao đổi & Chat nhóm
  - Khung Chat tối ưu chiều cao giao diện trên điện thoại (Mobile App Chat Feel).
  - Viết JS xử lý khi bấm nút "Gửi" để thêm tin nhắn mới ngay lập tức.

- [x] **Task 2.6:** Dựng Module 7 & 8 - Nộp bài & Đánh giá, Lịch sử chỉnh sửa
  - Khu vực Drag & Drop / Chọn file linh hoạt trên Mobile.
  - Timeline "Lịch sử chỉnh sửa" dạng giao diện dọc (Vertical Timeline) tối ưu màn hình nhỏ.

- [x] **Task 2.7:** Dựng Module 9 - Theo dõi Tiến độ (Dashboard)
  - Biểu đồ/Thanh tiến độ responsive tự co giãn theo kích thước màn hình.
  - Hiển thị danh sách tiến độ chi tiết từng nhiệm vụ.

- [x] **Task 2.8:** Dựng Module 10 - Tải Báo cáo Tiến độ Cá nhân
  - UI bộ lọc và nút Tải báo cáo PDF/Excel căn chỉnh phù hợp trên Mobile.
  - Tích hợp thư viện JS client-side (`html2pdf.js` / `xlsx.js`) để xuất file mẫu.

---

### Giai đoạn 3: Dữ liệu mẫu, Kiểm thử Responsive & Deploy

- [x] **Task 3.1:** Tích hợp Data Mẫu (`js/mockData.js`)
  - Viết dữ liệu JSON đầy đủ cho Nhiệm vụ, Tin nhắn Chat, Lịch sử chỉnh sửa.
- [x] **Task 3.2:** Kiểm thử & Tối ưu Responsive Toàn bộ Website
  - Test trên các kích thước màn hình: Desktop (1440px), Tablet (768px), Mobile (375px/414px).
  - Tối ưu trải nghiệm chạm/vuốt (Touch UX) trên điện thoại.
- [x] **Task 3.3:** Kiểm thử Relative Path & Deploy GitHub Pages
  - Đảm bảo toàn bộ đường dẫn ảnh/CSS/JS dùng đường dẫn tương đối (`./css/...`).
  - Push code và xác nhận ứng dụng chạy hoàn hảo trên link Live GitHub Pages.