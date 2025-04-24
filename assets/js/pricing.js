document.addEventListener("DOMContentLoaded", function () {
  const choosePlanLinks = document.querySelectorAll(".choose-plan");

  choosePlanLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Ngăn trình duyệt tải lại trang

      // Kiểm tra trạng thái đăng nhập
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";

      if (!isLoggedIn) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        alert("Bạn cần đăng nhập để chọn gói!");
        window.location.href = "/assets/pages/auth.html";
      } else {
        // Nếu đã đăng nhập, chuyển hướng đến trang checkout
        const selectedPlan = this.getAttribute("data-plan");
        localStorage.setItem("selectedPlan", selectedPlan); // Lưu gói đã chọn vào localStorage
        window.location.href = this.getAttribute("href");
      }
    });
  });
});

document.querySelectorAll(".choose-plan").forEach((button) => {
  button.addEventListener("click", function () {
    const courseName = this.getAttribute("data-course-name");
    const coursePrice = this.getAttribute("data-course-price");

    if (!courseName || !coursePrice) {
      alert("Không tìm thấy thông tin khóa học!");
      return;
    }

    localStorage.setItem("selectedCourse", courseName);
    localStorage.setItem("selectedCoursePrice", coursePrice);

    window.location.href = "/assets/pages/checkout.html";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.querySelector(".btn-sign-up");
  const logoutButton = document.querySelector("#logoutBtn");

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    // Nếu đã đăng nhập, hiển thị nút Log Out và ẩn nút Sign Up
    signUpButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");

    // Thêm sự kiện cho nút Log Out
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      alert("Bạn đã đăng xuất!");
      location.reload(); // Tải lại trang
    });
  } else {
    // Nếu chưa đăng nhập, hiển thị nút Sign Up và ẩn nút Log Out
    signUpButton.classList.remove("hidden");
    logoutButton.classList.add("hidden");
  }
});
