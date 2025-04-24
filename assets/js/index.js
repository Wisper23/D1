document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    // Hiển thị email người dùng đã đăng nhập (nếu cần)
    const userEmail = localStorage.getItem("userEmail");
    console.log("Người dùng đã đăng nhập:", userEmail);
  } else {
    // Người dùng chưa đăng nhập, nhưng vẫn có thể xem trang index.html
    console.log("Người dùng chưa đăng nhập.");
  }
});

// Xử lý sự kiện khi nhấn nút "Đăng nhập" trong trang auth.html
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".btn-sign-up");
  const logoutBtn = document.querySelector(".btn-logout");

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    // Nếu đã đăng nhập, ẩn nút "Sign Up" và hiển thị nút "Log Out"
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    // Nếu chưa đăng nhập, hiển thị nút "Sign Up" và ẩn nút "Log Out"
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  // Xử lý sự kiện đăng xuất
  logoutBtn.addEventListener("click", function () {
    // Xóa trạng thái đăng nhập khỏi localStorage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "./assets/pages/auth.html";
  });
});

// chuyển động phần minh họa bình luận
document.addEventListener("DOMContentLoaded", function () {
  const feedbackItems = document.querySelectorAll(".feedback-item");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;

  // Hàm cập nhật trạng thái active
  function updateActive(index) {
    feedbackItems.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Tự động chuyển đổi mỗi 3 giây
  function startAutoSlide() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % feedbackItems.length; // Chuyển sang phần tử tiếp theo
      updateActive(currentIndex);
    }, 5000); // 5000ms = 5s
  }

  // Gắn sự kiện click cho từng dot
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index; // Cập nhật chỉ số hiện tại
      updateActive(index);
    });
  });

  // Hiển thị phần tử đầu tiên mặc định
  updateActive(currentIndex);

  // Bắt đầu tự động chuyển đổi
  startAutoSlide();
});
