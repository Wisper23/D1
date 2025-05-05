const courses = [
  {
    id: 1,
    title: "Lập trình Web",
    price: "1.800.000đ",
    instructor: "Nguyễn Văn A",
  },
  { id: 2, title: "Marketing", price: "1.500.000đ", instructor: "Trần Thị B" },
  {
    id: 3,
    title: "Tiếng Anh giao tiếp",
    price: "1.200.000đ",
    instructor: "John Smith",
  },
  {
    id: 4,
    title: "Thiết kế UX/UI",
    price: "2.400.000đ",
    instructor: "Lê Văn C",
  },
  {
    id: 5,
    title: "Khoa học dữ liệu",
    price: "2.800.000đ",
    instructor: "Phạm Minh D",
  },
  {
    id: 6,
    title: "Lập trình Python",
    price: "2.100.000đ",
    instructor: "Nguyễn Thị E",
  },
  {
    id: 7,
    title: "Trí tuệ nhân tạo",
    price: "3.500.000đ",
    instructor: "Lê Văn F",
  },
  {
    id: 8,
    title: "An ninh mạng",
    price: "3.000.000đ",
    instructor: "Trần Quốc G",
  },
  {
    id: 9,
    title: "Basic Web Design",
    price: "1.200.000đ",
    instructor: "Nguyễn Văn H",
  },
  {
    id: 10,
    title: "Web App Design",
    price: "2.500.000đ",
    instructor: "Trần Thị I",
  },
  {
    id: 11,
    title: "Machine Learning",
    price: "3.800.000đ",
    instructor: "Lê Văn J",
  },
  {
    id: 12,
    title: "Cybersecurity Fundamentals",
    price: "2.800.000đ",
    instructor: "Phạm Minh K",
  },
];

// Lưu vào localStorage
localStorage.setItem("courses", JSON.stringify(courses));

// (Tùy chọn) Kiểm tra console
console.log("Đã lưu dữ liệu khóa học vào localStorage:", courses);

// window.courses = courses;
