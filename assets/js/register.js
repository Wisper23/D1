// Lấy form đăng ký
const registerForm = document.getElementById("registerForm");
const users = JSON.parse(localStorage.getItem("users")) || [];
users.push({ email: "admin@gmail.com", password: "123456" });
localStorage.setItem("users", JSON.stringify(users));
console.log("Tài khoản admin đã được thêm!");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Lấy giá trị từ form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Kiểm tra mật khẩu và xác nhận mật khẩu
  if (password !== confirmPassword) {
    alert("Mật khẩu và xác nhận mật khẩu không khớp!");
    return;
  }

  // Lấy danh sách người dùng từ localStorage (nếu có)
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra xem email đã tồn tại chưa
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("Email đã được sử dụng!");
    return;
  }

  // Thêm người dùng mới vào danh sách
  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Vui lòng đăng nhập.");
  window.location.href = "../pages/auth.html"; // Chuyển đến trang đăng nhập
});
