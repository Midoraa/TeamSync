# 🚀 TeamSync - Nền Tảng Hỗ Trợ Làm Bài Tập Nhóm Trực Tuyến (Frontend Web App)

> **Dự án Đồ Án Môn Học IT4409: Lập trình Web & Ứng dụng Phân tán**  
> **Nhóm thực hiện:** Nhóm 05  
> **Giảng viên hướng dẫn:** TS. Trần Văn Nam  
> **Đề tài:** Xây dựng nền tảng số hóa quản lý và cộng tác làm bài tập nhóm cho sinh viên đại học.

---

## 🌟 Giới Thiệu Tổng Quan

**TeamSync** là ứng dụng web frontend hoàn chỉnh (HTML5, Vanilla CSS3, JavaScript ES6) hỗ trợ nhóm sinh viên tổ chức, phân chia và theo dõi toàn bộ vòng đời làm bài tập lớn/đồ án môn học. Ứng dụng được thiết kế theo phong cách **Modern Clean Dashboard**, tương thích 100% trên cả Desktop, Tablet và Mobile.

---

## 🎨 Quy Chuẩn Design System (Strict Design System Rules)

* **CSS Variables:** Toàn bộ bảng màu, typography, spacing và border-radius được định nghĩa tập trung tại `css/variables.css`:
  * **Primary Color:** `#2563EB` (Xanh dương chủ đạo), Hover: `#1D4ED8`, Light: `#EFF6FF`
  * **Backgrounds:** Nền ứng dụng `#F3F4F6`, Thẻ Card `#FFFFFF`
  * **Text Colors:** Văn bản chính `#1F2937`, Văn bản phụ `#6B7280`
  * **Trạng thái (Status):** Thành công `#10B981`, Đang làm `#F59E0B`, Chưa làm `#9CA3AF`, Khẩn cấp `#EF4444`
  * **Typography:** Font hệ thống sạch Google Font `Inter` (`wght@400;500;600;700;800`)
  * **Bo góc & Đổ bóng:** `border-radius: 8px` - `12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.05)`

---

## 📱 Tiêu Chuẩn Responsive (Mobile & Tablet Requirements)

Mọi file CSS (`css/variables.css`, `css/style.css`, `css/modules.css`) đều bắt buộc khai báo CSS Variables và có block `@media (max-width: 768px)`:
* **Mobile (< 768px):**
  * Sidebar tự động chuyển thành **Overlay Drawer** (ẩn mặc định, mở ra bằng nút Hamburger menu `☰` ở Header, kèm lớp phủ nền mờ `backdrop-filter`).
  * Tất cả các bố cục Grid tự động chuyển thành **1 cột duy nhất (Single Column)**.
  * Toàn bộ buttons, navigation items, inputs đạt chiều cao chuẩn công thái học **tối thiểu `44px`** cho thao tác chạm/vuốt.
  * Bảng dữ liệu có tính năng cuộn ngang mượt mà (`overflow-x: auto`), không bị tràn vỡ giao diện.
* **Tablet (768px - 1024px):**
  * Các thẻ thống kê hiển thị 2 cột cân đối, giao diện co giãn fluid adaptive.
* **Desktop (> 1024px):**
  * Sidebar cố định bên trái, Header cố định phía trên, giao diện rộng rãi tối đa 1440px.

---

## 🛠️ Các Module Chức Năng Chính (10 Modules)

1. **Module 1: Quản lý Tài khoản & Quick Role Switcher**
   * Đăng nhập / Đăng ký mô phỏng lưu trữ bằng `localStorage`.
   * Hỗ trợ chuyển đổi nhanh giữa các thành viên nhóm (*Hải Đăng, Mai Phương, Hoàng Long, Thùy Linh, Quốc Bảo*) để trải nghiệm góc nhìn của từng vai trò.
2. **Module 2: Quản lý Nhóm & Thành viên**
   * Tìm kiếm thành viên tức thì theo tên, MSSV, email hoặc kỹ năng.
   * Thêm thành viên mới vào danh sách nhóm với validation hợp lệ.
3. **Module 3: Bầu chọn Nhóm trưởng Dân chủ**
   * Thẻ ứng viên kèm thanh tiến độ số phiếu và tỷ lệ %.
   * Tự động highlight ứng viên dẫn đầu (`👑 Đang dẫn đầu`) và cập nhật quyền Nhóm trưởng trên toàn hệ thống.
   * Nút ứng cử mở form cho phép bất kỳ thành viên nào tham gia tranh cử.
4. **Module 4 & 5: Bảng Phân công & Nhận nhiệm vụ**
   * Lọc công việc theo tab (*Tất cả, Chưa nhận, Đang làm, Hoàn thành*) và ô tìm kiếm từ khóa.
   * Tạo nhiệm vụ mới tự động sinh mã `TASK-09`, `TASK-10`...
   * Modal chi tiết cho phép *Nhận nhiệm vụ*, *Hủy nhận việc*, hoặc *Đánh dấu hoàn thành*.
5. **Module 6: Trao đổi & Khung Chat Nhóm**
   * Phòng chat phong cách Mobile App với tin nhắn gửi/nhận riêng biệt.
   * Thanh gợi ý tin nhắn nhanh (Quick Replies).
   * **Simulated Teammate Auto-Reply:** Có Typing Indicator và đồng đội tự động gửi phản hồi sau 1.2s giúp phòng chat sống động.
6. **Module 7 & 8: Nộp bài, Nhận xét & Timeline Lịch sử Chỉnh sửa**
   * Kéo thả file nộp bài (hỗ trợ zip, pdf, docx), dropdown chọn nhiệm vụ liên quan.
   * Tự động tăng số phiên bản (`v1.4`, `v1.5`...).
   * Trục thời gian dạng dọc (*Vertical Timeline*) hiển thị các phiên bản v1.0, v1.1, v1.2, v1.3 kèm điểm số và nhận xét từ giảng viên.
7. **Module 9: Dashboard Theo dõi Tiến độ**
   * 4 thẻ thống kê số liệu tổng quan.
   * Thanh tiến độ tổng quan tự động tính tỉ lệ hoàn thành `%`.
   * Thống kê tỷ lệ hoàn thành nhiệm vụ theo từng thành viên trong nhóm.
8. **Module 10: Tải Báo cáo Tiến độ Cá nhân & Nhóm**
   * Bộ lọc xem trước báo cáo theo thành viên và trạng thái.
   * Xuất file **Excel (CSV)** chuẩn UTF-8 có BOM tiếng Việt.
   * Xuất file **PDF** chuyên nghiệp chuẩn tài liệu A4 bằng `@media print`.

---

## 📁 Cấu Trúc Thư Mục

```
TAM/
│
├── index.html              # Trang chủ giao diện chính (Semantic HTML5, Relative paths)
├── task.md                 # Antigravity Tasklist & Quy chuẩn thiết kế
├── README.md               # Tài liệu hướng dẫn dự án & Hướng dẫn Deploy
├── .gitignore              # Bộ lọc file rác khi đẩy lên Git
│
├── css/
│   ├── variables.css       # CSS Variables hạt nhân & responsive variables
│   ├── style.css           # App Shell Layout, Header, Sidebar Drawer, Modals, Print
│   └── modules.css         # Styles chi tiết cho 10 module chức năng
│
├── js/
│   └── main.js             # Logic xử lý điều hướng, state management, tương tác
│
├── data/
│   └── mockData.js         # Dữ liệu mẫu JSON (Nhóm, thành viên, task, chat, version)
│
└── assets/
    └── images/
        └── favicon.svg     # Icon biểu tượng thương hiệu
```

---

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages

Toàn bộ đường dẫn tài nguyên trong dự án đều sử dụng đường dẫn tương đối (`./css/...`, `./js/...`, `./data/...`), đảm bảo ứng dụng chạy hoàn hảo trên GitHub Pages mà không gặp lỗi 404.

### Cách 1: Sử dụng Git CLI (Khuyên dùng)

1. **Khởi tạo và commit mã nguồn:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete TeamSync group assignment web app"
   ```

2. **Tạo repository mới trên GitHub:**
   * Truy cập [https://github.com/new](https://github.com/new)
   * Đặt tên repository: `teamsync-app` (hoặc tên tùy chọn), chọn chế độ **Public**.

3. **Liên kết và đẩy mã nguồn lên GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```

4. **Kích hoạt GitHub Pages:**
   * Vào **Settings** của repository trên GitHub.
   * Chọn mục **Pages** ở thanh menu bên trái.
   * Tại phần **Branch**, chọn `main` và thư mục `/ (root)`.
   * Bấm **Save**. Sau 1-2 phút, trang web của bạn sẽ hiển thị trực tuyến tại:
     `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`

### Cách 2: Tải trực tiếp lên giao diện GitHub Web

1. Tạo repository mới trên GitHub (Public).
2. Bấm nút **Add file** -> **Upload files**.
3. Kéo thả toàn bộ các file (`index.html`, thư mục `css/`, `js/`, `data/`, `assets/`, `README.md`) vào và bấm **Commit changes**.
4. Vào mục **Settings** -> **Pages** -> chọn branch `main` và bấm **Save**.
