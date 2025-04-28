// Reset trạng thái đăng nhập mỗi khi mở lại trang (tùy chọn)
localStorage.removeItem("loggedIn");
localStorage.removeItem("userEmail");
localStorage.removeItem("userRole");

// Chờ toàn bộ DOM được tải xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử nút
  const loginBtn = document.querySelector(".btn-sign-up"); // nút "Sign Up"
  const logoutBtn = document.querySelector(".btn-logout"); // nút "Log Out"

  // Kiểm tra trạng thái đăng nhập từ localStorage
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");

  // Nếu đã đăng nhập → in email người dùng ra console
  if (isLoggedIn) {
    console.log("Người dùng đã đăng nhập:", userEmail);
  } else {
    console.log("Người dùng chưa đăng nhập.");
  }

  // Nếu tồn tại 2 nút đăng nhập / đăng xuất → xử lý hiển thị
  if (loginBtn && logoutBtn) {
    // Nếu đang đăng nhập → ẩn nút đăng ký, hiện nút đăng xuất
    loginBtn.classList.toggle("hidden", isLoggedIn);
    logoutBtn.classList.toggle("hidden", !isLoggedIn);

    // Gán sự kiện khi nhấn nút "Log Out"
    logoutBtn.addEventListener("click", function () {
      // Xóa thông tin đăng nhập khỏi localStorage
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userEmail");

      // Chuyển hướng về trang đăng nhập
      window.location.href = "/assets/pages/auth.html";
    });
  }

  // ----------------------
  // Slide chuyển động bình luận
  // ----------------------

  // Lấy danh sách các phần tử bình luận và dot
  const feedbackItems = document.querySelectorAll(".feedback-item");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0; // Chỉ số hiện tại đang hiển thị

  // Hàm cập nhật "active" cho bình luận và dot tương ứng
  function updateActive(index) {
    feedbackItems.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Hàm tự động chuyển slide sau mỗi 5 giây
  function startAutoSlide() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % feedbackItems.length;
      updateActive(currentIndex);
    }, 5000); // 5000ms = 5 giây
  }

  // Gán sự kiện click cho các chấm tròn (dot)
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateActive(index);
    });
  });

  // Khởi tạo: hiển thị phần tử đầu tiên
  updateActive(currentIndex);
  // Bắt đầu auto slide
  startAutoSlide();
});
