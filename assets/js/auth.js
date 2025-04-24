const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Kiểm tra nếu là admin
  if (email === "admin@gmail.com" && password === "123456") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", "admin");
    localStorage.setItem("userEmail", email);
    alert("Đăng nhập admin thành công!");
    window.location.href = "/assets/pages/admin.html";
    return;
  }

  // Lấy danh sách người dùng từ <localSto></localSto>rage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Kiểm tra thông tin đăng nhập
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("userEmail", email);
    alert("Đăng nhập thành công!");
    window.location.href = "/index.html";
  } else {
    alert("Email hoặc mật khẩu không đúng!");
  }
});
