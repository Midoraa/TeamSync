/**
 * DỮ LIỆU MẪU MÔ PHỎNG (MOCK DATA)
 * Nền tảng Hỗ trợ Bài Tập Nhóm - Frontend Web App
 */

const mockData = {
  // 1. Thông tin Nhóm hiện tại
  currentGroup: {
    id: "grp-05",
    code: "WEB2026-N05",
    name: "Nhóm 05 - Phát Triển Web Hiện Đại",
    topic: "Xây dựng nền tảng số hóa quản lý và cộng tác làm bài tập nhóm cho sinh viên đại học",
    subject: "Lập trình Web & Ứng dụng Phân tán (IT4409)",
    instructor: "TS. Trần Văn Nam",
    semester: "Học kỳ 1 - 2026",
    leaderId: "mem-01",
    totalMembers: 5,
    createdAt: "2026-10-15"
  },

  // 2. Tài khoản người dùng hiện tại (Mặc định null khi chưa đăng nhập)
  currentUser: null,

  // 3. Danh sách Thành viên trong nhóm (Module 2)
  members: [
    {
      id: "mem-01",
      name: "Nguyễn Hải Đăng",
      studentId: "20210123",
      email: "haidang.nguyen@student.edu.vn",
      role: "Nhóm trưởng",
      skills: ["Frontend", "UI/UX", "Quản lý nhóm"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      status: "online",
      tasksCompleted: 4,
      tasksActive: 1,
      votes: 4
    },
    {
      id: "mem-02",
      name: "Trần Mai Phương",
      studentId: "20210456",
      email: "maiphuong.tran@student.edu.vn",
      role: "Thành viên",
      skills: ["Backend API", "Node.js", "Cơ sở dữ liệu"],
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      status: "online",
      tasksCompleted: 3,
      tasksActive: 2,
      votes: 1
    },
    {
      id: "mem-03",
      name: "Lê Hoàng Long",
      studentId: "20210789",
      email: "hoanglong.le@student.edu.vn",
      role: "Thành viên",
      skills: ["CSS Layout", "Responsive", "Kiểm thử"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      status: "offline",
      tasksCompleted: 2,
      tasksActive: 1,
      votes: 0
    },
    {
      id: "mem-04",
      name: "Phạm Thùy Linh",
      studentId: "20210992",
      email: "thuylinh.pham@student.edu.vn",
      role: "Thành viên",
      skills: ["Báo cáo", "Tài liệu kỹ thuật", "Slide thuyết trình"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      status: "online",
      tasksCompleted: 3,
      tasksActive: 1,
      votes: 0
    },
    {
      id: "mem-05",
      name: "Đỗ Quốc Bảo",
      studentId: "20211234",
      email: "quocbao.do@student.edu.vn",
      role: "Thành viên",
      skills: ["DevOps", "Deploy Server", "GitHub Actions"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      status: "offline",
      tasksCompleted: 1,
      tasksActive: 1,
      votes: 0
    }
  ],

  // 4. Bầu chọn Nhóm trưởng (Module 3)
  election: {
    status: "active", // "active" hoặc "closed"
    title: "Bầu chọn Trưởng nhóm Đồ án Môn học Kỳ 1",
    totalVotes: 5,
    candidates: [
      {
        memberId: "mem-01",
        name: "Nguyễn Hải Đăng",
        slogan: "Cam kết phân chia việc công bằng, hỗ trợ kỹ thuật và bám sát tiến độ nộp bài đúng hạn 100%.",
        experience: "Đã làm trưởng nhóm 3 đồ án chuyên ngành đạt điểm A.",
        votes: 4,
        isLeading: true
      },
      {
        memberId: "mem-02",
        name: "Trần Mai Phương",
        slogan: "Ưu tiên chất lượng code, tổ chức họp nhóm ngắn gọn súc tích và hỗ trợ kết nối API suôn sẻ.",
        experience: "Nắm vững kiến trúc phần mềm, có kinh nghiệm thực tập Backend.",
        votes: 1,
        isLeading: false
      },
      {
        memberId: "mem-03",
        name: "Lê Hoàng Long",
        slogan: "Sẵn sàng hỗ trợ các bạn còn yếu về Frontend và dành tối đa thời gian cho dự án.",
        experience: "Thành thạo Git workflow và code review cẩn thận.",
        votes: 0,
        isLeading: false
      }
    ]
  },

  // 5. Danh sách Phân công & Nhận nhiệm vụ (Module 4 & 5)
  tasks: [
    {
      id: "task-01",
      code: "TASK-01",
      title: "Thiết kế Bản vẽ Wireframe & Prototype Figma",
      description: "Lên bố cục các màn hình Dashboard, Khung Chat, Nộp bài và Phân công nhiệm vụ trên Figma kèm bản vẽ Responsive điện thoại.",
      deadline: "2026-11-04",
      priority: "Cao",
      status: "done", // "todo", "in_progress", "done"
      assigneeId: "mem-01",
      assigneeName: "Nguyễn Hải Đăng",
      assigneeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      attachments: ["Figma_Project_Specs.pdf", "Design_System_Colors.png"],
      note: "Đã chốt phong cách Clean Dashboard màu #2563EB."
    },
    {
      id: "task-02",
      code: "TASK-02",
      title: "Dựng Cấu trúc HTML & Khung App Layout CSS",
      description: "Xây dựng bố cục Header, Sidebar Drawer trên Mobile và Main Content theo đúng chuẩn Responsive Mobile-First.",
      deadline: "2026-11-06",
      priority: "Cao",
      status: "in_progress",
      assigneeId: "mem-01",
      assigneeName: "Nguyễn Hải Đăng",
      assigneeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      attachments: ["Layout_Guidelines.md"],
      note: "Đang hoàn thiện hiệu ứng mở Sidebar mượt mà trên điện thoại."
    },
    {
      id: "task-03",
      code: "TASK-03",
      title: "Xây dựng Mock Data JSON & Logic Lưu Trữ LocalStorage",
      description: "Thiết lập dữ liệu sinh viên, nhiệm vụ, tin nhắn chat và lịch sử chỉnh sửa để phục vụ tương tác trên trình duyệt.",
      deadline: "2026-11-07",
      priority: "Trung bình",
      status: "done",
      assigneeId: "mem-02",
      assigneeName: "Trần Mai Phương",
      assigneeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      attachments: ["schema_data.json"],
      note: "Data tương thích hoàn toàn cấu trúc client-side."
    },
    {
      id: "task-04",
      code: "TASK-04",
      title: "Module Trao đổi & Khung Chat Nhóm Trực Tuyến",
      description: "Lập trình giao diện tin nhắn, gửi text tức thời, hiển thị avatar, đính kèm tệp văn bản và tối ưu trải nghiệm chạm trên điện thoại.",
      deadline: "2026-11-09",
      priority: "Cao",
      status: "todo",
      assigneeId: null, // Chưa nhận
      assigneeName: "Chưa nhận",
      assigneeAvatar: "",
      attachments: ["Chat_UI_Reference.png"],
      note: "Nhiệm vụ mở, bất kỳ thành viên nào cũng có thể nhận."
    },
    {
      id: "task-05",
      code: "TASK-05",
      title: "Module Nộp Bài, Đánh Giá & Timeline Lịch Sử v1.0 - v1.3",
      description: "Khu vực kéo thả file bài nộp, ô nhập ghi chú, hiển thị điểm/nhận xét của giảng viên và timeline theo dõi các lần nộp lại.",
      deadline: "2026-11-12",
      priority: "Cao",
      status: "todo",
      assigneeId: null,
      assigneeName: "Chưa nhận",
      assigneeAvatar: "",
      attachments: ["Submission_Criteria.pdf"],
      note: "Cần hỗ trợ các file zip, pdf, docx."
    },
    {
      id: "task-06",
      code: "TASK-06",
      title: "Module Dashboard Theo Dõi Tiến Độ & Biểu Đồ Thống Kê",
      description: "Trực quan hóa tỉ lệ hoàn thành nhiệm vụ theo thành viên và toàn nhóm, hiển thị thẻ thống kê % và bộ đếm.",
      deadline: "2026-11-14",
      priority: "Trung bình",
      status: "in_progress",
      assigneeId: "mem-04",
      assigneeName: "Phạm Thùy Linh",
      assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      attachments: ["Chart_Requirements.xlsx"],
      note: "Đang viết logic thanh tiến độ SVG/CSS."
    },
    {
      id: "task-07",
      code: "TASK-07",
      title: "Tích Hợp Xuất Báo Cáo Tiến Độ PDF & Excel",
      description: "Lập trình chức năng tải báo cáo bảng phân công cá nhân và nhóm sang tệp PDF in ấn đẹp hoặc Excel để nộp cho thầy cô.",
      deadline: "2026-11-16",
      priority: "Trung bình",
      status: "todo",
      assigneeId: null,
      assigneeName: "Chưa nhận",
      assigneeAvatar: "",
      attachments: [],
      note: "Dùng thư viện html2pdf.js / xlsx.js."
    },
    {
      id: "task-08",
      code: "TASK-08",
      title: "Kiểm Thử Responsive Đa Màn Hình & Deploy GitHub Pages",
      description: "Kiểm tra kỹ lưỡng giao diện trên thiết bị di động (<768px), Tablet (768px-1024px) và Desktop, đảm bảo đường dẫn tương đối hoạt động 100%.",
      deadline: "2026-11-18",
      priority: "Khẩn cấp",
      status: "todo",
      assigneeId: "mem-05",
      assigneeName: "Đỗ Quốc Bảo",
      assigneeAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      attachments: ["Deploy_Checklist.md"],
      note: "Sẽ cấu hình GitHub Actions tự động build nếu cần."
    }
  ],

  // 6. Tin nhắn Chat nhóm (Module 6)
  chatMessages: [
    {
      id: "msg-01",
      senderId: "mem-02",
      senderName: "Trần Mai Phương",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      timestamp: "08:30 Hôm qua",
      text: "Chào mọi người! Mình đã cập nhật xong cấu trúc JSON dữ liệu mẫu và đẩy vào thư mục data rồi nhé.",
      attachment: {
        name: "mockData_v1.json",
        size: "18.4 KB",
        type: "code"
      }
    },
    {
      id: "msg-02",
      senderId: "mem-01",
      senderName: "Nguyễn Hải Đăng",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      timestamp: "09:15 Hôm qua",
      text: "Tuyệt vời Phương ơi! Phần giao diện Responsive và CSS Variables mình cũng vừa quy chuẩn xong màu sắc chính và nút Hamburger trên điện thoại.",
      attachment: null
    },
    {
      id: "msg-03",
      senderId: "mem-04",
      senderName: "Phạm Thùy Linh",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      timestamp: "10:45 Hôm qua",
      text: "Mình đã soạn sẵn Đề cương Báo cáo giữa kỳ, mọi người xem qua bản nháp này xem cần bổ sung mục nào không nhé!",
      attachment: {
        name: "DeCuong_BaoCao_Nhom05.pdf",
        size: "1.2 MB",
        type: "pdf"
      }
    },
    {
      id: "msg-04",
      senderId: "mem-03",
      senderName: "Lê Hoàng Long",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      timestamp: "14:20 Hôm qua",
      text: "Đã xem bản PDF của Linh nhé, phần mục lục rất đầy đủ. Chiều nay mình sẽ test thử giao diện form nhận task trên điện thoại.",
      attachment: null
    },
    {
      id: "msg-05",
      senderId: "mem-01",
      senderName: "Nguyễn Hải Đăng",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      timestamp: "09:05 Hôm nay",
      text: "Hôm nay chúng ta hoàn thiện nốt Module Bầu chọn Nhóm trưởng và Bảng phân công nhiệm vụ nhé cả nhóm! Cố lên nào! 🔥",
      attachment: null
    }
  ],

  // 7. Lịch sử Nộp bài & Chỉnh sửa (Module 7 & 8)
  submissions: [
    {
      version: "v1.3",
      title: "Báo cáo Tiến độ Đồ án Sprint 2 & Source Code Demo",
      submittedBy: "Nguyễn Hải Đăng (Nhóm trưởng)",
      timestamp: "2026-11-01 10:30",
      fileUrl: "#",
      fileName: "BaoCao_Sprint2_Nhom05_v1.3.zip",
      fileSize: "14.8 MB",
      note: "Cập nhật hoàn chỉnh Responsive trên điện thoại, tích hợp bầu chọn nhóm trưởng và khung chat nhóm tức thời.",
      status: "reviewed", // "pending", "reviewed"
      score: "9.5/10",
      feedback: "Giao diện Dashboard rất sáng, phong cách đồng bộ và responsive mượt trên mobile. Rất đáng khen ngợi!"
    },
    {
      version: "v1.2",
      title: "Bổ sung tài liệu Kiến trúc Hệ thống & Data Model",
      submittedBy: "Trần Mai Phương",
      timestamp: "2026-10-27 16:45",
      fileUrl: "#",
      fileName: "KienTruc_HeThong_v1.2.pdf",
      fileSize: "3.2 MB",
      note: "Bổ sung lược đồ thực thể cơ sở dữ liệu và đặc tả luồng người dùng nhận nhiệm vụ.",
      status: "reviewed",
      score: "9.0/10",
      feedback: "Sơ đồ rõ ràng, cần chi tiết hơn về phần phân quyền."
    },
    {
      version: "v1.1",
      title: "Bản vẽ Wireframe chi tiết & Danh sách nhiệm vụ ban đầu",
      submittedBy: "Lê Hoàng Long",
      timestamp: "2026-10-22 14:10",
      fileUrl: "#",
      fileName: "Wireframe_Figma_v1.1.pdf",
      fileSize: "5.6 MB",
      note: "Chỉnh sửa góc bo thẻ và bảng màu xanh chuẩn #2563EB theo góp ý của thầy.",
      status: "reviewed",
      score: "8.5/10",
      feedback: "Tốt hơn phiên bản đầu rất nhiều, hãy tiếp tục phát huy."
    },
    {
      version: "v1.0",
      title: "Đề cương Đồ án Môn học & Danh sách Phân công Thành viên",
      submittedBy: "Nguyễn Hải Đăng",
      timestamp: "2026-10-18 09:00",
      fileUrl: "#",
      fileName: "DeCuong_BanDau_v1.0.docx",
      fileSize: "840 KB",
      note: "Nộp đề cương đăng ký đề tài chính thức cho Giảng viên hướng dẫn.",
      status: "reviewed",
      score: "Đạt",
      feedback: "Đề tài có tính ứng dụng thực tiễn cao, đồng ý thông qua đề cương."
    }
  ],

  // 8. Thống kê tiến độ (Module 9)
  stats: {
    totalTasks: 8,
    doneTasks: 2,
    inProgressTasks: 2,
    todoTasks: 4,
    percentComplete: 35,
    daysRemaining: 17,
    lastUpdated: "2026-11-01"
  },

  // 9. Lịch sử hoạt động gần đây (Recent Activities)
  activities: [
    {
      id: "act-01",
      user: "Nguyễn Hải Đăng",
      action: "đã cập nhật trạng thái nhiệm vụ",
      target: "TASK-02: Dựng Khung App Layout CSS sang 'Đang làm'",
      time: "15 phút trước",
      type: "task"
    },
    {
      id: "act-02",
      user: "Phạm Thùy Linh",
      action: "đã đính kèm tệp văn bản",
      target: "DeCuong_BaoCao_Nhom05.pdf vào khung chat",
      time: "2 giờ trước",
      type: "chat"
    },
    {
      id: "act-03",
      user: "Trần Mai Phương",
      action: "đã hoàn thành nhiệm vụ",
      target: "TASK-03: Xây dựng Mock Data JSON",
      time: "Hôm qua",
      type: "task"
    },
    {
      id: "act-04",
      user: "TS. Trần Văn Nam",
      action: "đã chấm điểm và gửi nhận xét bài nộp",
      target: "Bản nộp v1.3 - Điểm 9.5/10",
      time: "2 ngày trước",
      type: "grade"
    }
  ]
};

// Đảm bảo dữ liệu có thể dùng ở cả trình duyệt hoặc import module nếu cần
if (typeof window !== "undefined") {
  window.mockData = mockData;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = mockData;
}
