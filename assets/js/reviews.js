document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav ul");

  // Xử lý sự kiện click vào nút menu
  mobileMenuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active"); // Thêm hoặc xóa class "active" cho menu
  });
});
