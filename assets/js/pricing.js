// Đợi DOM được tải xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các nút hoặc liên kết có class "choose-plan"
  const choosePlanButtons = document.querySelectorAll(".choose-plan");

  // Gắn sự kiện click cho từng nút
  choosePlanButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Kiểm tra trạng thái đăng nhập
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";

      if (!isLoggedIn) {
        // Nếu chưa đăng nhập, hiển thị thông báo và chuyển hướng đến trang đăng nhập
        alert("Bạn cần đăng nhập để chọn gói!");
        window.location.href = "../pages/auth.html";
        return;
      }

      // Nếu đã đăng nhập, lấy thông tin gói và khóa học từ thuộc tính data
      const selectedPlan = this.getAttribute("data-plan");
      const courseName = this.getAttribute("data-course-name");
      const coursePrice = this.getAttribute("data-course-price");

      // Lưu thông tin gói và khóa học vào localStorage
      localStorage.setItem("selectedPlan", selectedPlan);
      localStorage.setItem("selectedCourse", courseName);
      localStorage.setItem("selectedCoursePrice", coursePrice);

      // Chuyển hướng đến trang checkout
      window.location.href =
        this.getAttribute("href") || "../pages/checkout.html";
    });
  });

  // Xử lý hiển thị nút đăng ký và đăng xuất
  const signUpButton = document.querySelector(".btn-sign-up");
  const logoutButton = document.querySelector("#logoutBtn");

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    // Nếu đã đăng nhập, hiển thị nút Log Out và ẩn nút Sign Up
    if (signUpButton) signUpButton.classList.add("hidden");
    if (logoutButton) logoutButton.classList.remove("hidden");

    // Gắn sự kiện click cho nút Log Out
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        // Xóa thông tin đăng nhập khỏi localStorage
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        // Hiển thị thông báo và tải lại trang
        alert("Bạn đã đăng xuất!");
        window.location.href = "../pages/auth.html"; // Chuyển hướng về trang đăng nhập
      });
    }
  } else {
    // Nếu chưa đăng nhập, hiển thị nút Sign Up và ẩn nút Log Out
    if (signUpButton) signUpButton.classList.remove("hidden");
    if (logoutButton) logoutButton.classList.add("hidden");
  }
});

// Xử lý logic thanh toán
document.addEventListener("DOMContentLoaded", function () {
  const choosePlanButtons = document.querySelectorAll(".choose-plan");
  const paymentModal = document.getElementById("paymentModal");
  const closePaymentModal = document.getElementById("closePaymentModal");
  const selectedPlanName = document.getElementById("selectedPlanName");
  const selectedPlanPrice = document.getElementById("selectedPlanPrice");
  const payWithMoMoButton = document.getElementById("payWithMoMo");
  const payWithVNPayButton = document.getElementById("payWithVNPay");
  const completePaymentButton = document.getElementById("completePayment");

  let currentPlan = null;

  // Hiển thị modal khi nhấn "Chọn Gói"
  choosePlanButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      currentPlan = {
        name: this.getAttribute("data-plan-name"),
        price: this.getAttribute("data-plan-price"),
      };
      selectedPlanName.textContent = currentPlan.name;
      selectedPlanPrice.textContent = currentPlan.price;
      paymentModal.classList.remove("hidden");
    });
  });

  // Đóng modal
  closePaymentModal.addEventListener("click", function () {
    paymentModal.classList.add("hidden");
  });

  // Xử lý thanh toán qua MoMo
  payWithMoMoButton.addEventListener("click", function () {
    alert("Bạn đã chọn thanh toán qua MoMo!");
    completePaymentButton.classList.remove("hidden");
  });

  // Xử lý thanh toán qua VNPay
  payWithVNPayButton.addEventListener("click", function () {
    alert("Bạn đã chọn thanh toán qua VNPay!");
    completePaymentButton.classList.remove("hidden");
  });

  // Hoàn thành thanh toán
  completePaymentButton.addEventListener("click", function () {
    alert(
      `Thanh toán thành công gói ${currentPlan.name} với giá ${currentPlan.price}!`
    );
    paymentModal.classList.add("hidden");
  });
});
