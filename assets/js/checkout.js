// Kiểm tra khi trang thanh toán được load
document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra trạng thái đăng nhập
  if (localStorage.getItem("loggedIn") !== "true") {
    alert("Vui lòng đăng nhập để thanh toán");
    window.location.href = "../pages/auth.html"; // Chuyển đến trang đăng nhập nếu chưa login
    return;
  }

  // Hiển thị email người dùng đang đăng nhập
  const userEmail = localStorage.getItem("userEmail");
  document.getElementById("userEmail").textContent = userEmail || "Khách";

  // Xử lý khi nhấn nút thanh toán qua MoMo
  document.getElementById("payWithMoMo").addEventListener("click", () => {
    showQRModal("MoMo", "../img/qrmomo.jpg");
  });

  // Xử lý khi nhấn nút thanh toán qua VNPay
  document.getElementById("payWithVNPay").addEventListener("click", () => {
    showQRModal("VNPay", "../img/qrmomo.jpg");
  });

  // Đóng modal QR khi nhấn nút x
  document.getElementById("closeQrModal").addEventListener("click", () => {
    document.getElementById("qrModal").classList.add("hidden");
  });

  // Khi người dùng nhấn “Hoàn thành thanh toán”
  document
    .getElementById("completePayment")
    .addEventListener("click", completePayment);
});

// Hiển thị modal QR thanh toán
function showQRModal(paymentMethod, qrImage) {
  const courseName = localStorage.getItem("selectedCourse");
  const coursePrice = localStorage.getItem("selectedCoursePrice");

  if (!courseName || !coursePrice) {
    alert("Không tìm thấy thông tin khóa học");
    return;
  }

  // Gán thông tin vào modal
  document.getElementById("paymentAmount").textContent = coursePrice;
  document.getElementById("qrCodeImage").src = qrImage;
  document.querySelector(
    "#qrModal h3"
  ).textContent = `Thanh toán qua ${paymentMethod}`;
  document.getElementById("qrModal").classList.remove("hidden");
}

// Hàm xử lý khi thanh toán hoàn tất
function completePayment() {
  const transactionData = {
    userEmail: localStorage.getItem("userEmail"),
    courseName: localStorage.getItem("selectedCourse"),
    coursePrice: localStorage.getItem("selectedCoursePrice"),
    date: new Date().toISOString(),
  };

  // Lưu thông tin mua hàng
  saveTransaction(transactionData);

  // Link file tải từ Google Drive (sửa ID nếu cần)
  const fileId = "1jIznL9VGOUxKH20B7OJ7Nr2v8YbiXFT7";
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const fileName = "TaiLieuKhoaHoc.pdf";

  // Tạo HTML tải file
  const downloadPageHTML = createDownloadPage(downloadUrl, fileName);

  // Ẩn modal QR
  document.getElementById("qrModal").classList.add("hidden");

  // Ghi trực tiếp trang tải xuống vào document hiện tại
  document.open();
  document.write(downloadPageHTML);
  document.close();
}

// Lưu giao dịch vào localStorage
function saveTransaction(data) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Tìm user trong danh sách
  let user = users.find((u) => u.email === data.userEmail);

  // Nếu chưa có thì tạo mới
  if (!user) {
    user = {
      email: data.userEmail,
      name: data.userEmail.split("@")[0],
      purchasedCourses: [],
    };
    users.push(user);
  }

  // Nếu đã có mà thiếu purchasedCourses thì thêm vào
  if (!Array.isArray(user.purchasedCourses)) {
    user.purchasedCourses = [];
  }

  // Thêm khóa học đã mua
  user.purchasedCourses.push({
    courseName: data.courseName,
    purchaseDate: data.date,
    price: data.coursePrice,
  });

  // Cập nhật lại localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Lưu lịch sử hoạt động
  let activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.push({
    time: data.date,
    user: data.userEmail,
    action: "Mua khóa học",
    details: `${data.courseName} - ${data.coursePrice}`,
  });
  localStorage.setItem("activities", JSON.stringify(activities));
}

// Tạo HTML cho trang tải file
function createDownloadPage(downloadUrl, fileName) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tải tài liệu khóa học</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 50px; display: flex; align-items: center; justify-content: center; height: 100vh; }
    .box { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: #4CAF50; }
    p { margin: 20px 0; font-size: 18px; }
    .btn { background: #4285F4; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 20px; }
    .btn:hover { background: #3367D6; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🎉 Thanh toán thành công!</h1>
    <p>Cảm ơn bạn đã mua khóa học. Tài liệu đã sẵn sàng để tải về:</p>
    <a class="btn" href="${downloadUrl}" download="${fileName}">📥 Tải ${fileName}</a><br/>
    <br/>
    <a href="../pages/courses.html">← Quay về khóa học</a>
  </div>
</body>
</html>
  `;
}
