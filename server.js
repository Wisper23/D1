// server.js

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để đọc JSON và form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, Images...)
app.use(express.static(path.join(__dirname, "index" , "assets")));

// API giả lập: Xử lý gửi form liên hệ
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("New contact message:", { name, email, message });
  res.json({ status: "success", message: "Cảm ơn bạn đã liên hệ!" });
});

// API giả lập: Xử lý đăng ký nhận tin
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;
  console.log("New subscription:", { email });
  res.json({ status: "success", message: "Đăng ký nhận tin thành công!" });
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
