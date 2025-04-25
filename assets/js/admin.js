// Kiểm tra đăng nhập trước khi vào trang admin
document.addEventListener("DOMContentLoaded", function () {
  try {
    // Kiểm tra trạng thái đăng nhập và quyền admin
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isLoggedIn || userRole !== "admin") {
      // Chuyển hướng nếu không có quyền truy cập
      alert("Bạn không có quyền truy cập trang admin.");
      window.location.href = "../pages/auth.html";
      return;
    }

    // Tải dữ liệu và hiển thị các bảng
    loadDashboardData();
    loadUserTable();
    loadCourseTable();
    loadActivityTable();

    // Mặc định hiển thị phần dashboard
    showSection("dashboardContent");
  } catch (error) {
    console.error("Đã xảy ra lỗi khi tải dữ liệu:", error);
  }

  // Xử lý sự kiện đăng xuất
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("adminLoggedIn");
    alert("Bạn đã đăng xuất!");
    window.location.href = "../pages/auth.html";
  });

  // Thêm sự kiện chuyển tab menu
  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "") + "Content";

      // Đổi trạng thái active cho menu
      document
        .querySelectorAll(".sidebar-menu li")
        .forEach((li) => li.classList.remove("active"));
      this.parentElement.classList.add("active");

      // Hiển thị nội dung tương ứng
      showSection(targetId);
    });
  });
});

// Hiển thị một phần nội dung cụ thể và ẩn các phần khác
function showSection(sectionId) {
  const allSections = document.querySelectorAll(".main-section");
  allSections.forEach((section) => (section.style.display = "none"));

  const target = document.getElementById(sectionId);
  if (target) target.style.display = "block";
}

// Hàm chung để điền dữ liệu vào bảng
function populateTable(tableId, data, rowTemplate) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";
  if (!data || data.length === 0) {
    // Hiển thị thông báo nếu không có dữ liệu
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" style="text-align: center;">Không có dữ liệu</td>`;
    table.appendChild(row);
    return;
  }

  // Tạo các hàng dữ liệu từ mẫu
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = rowTemplate(item);
    table.appendChild(row);
  });
}

// Tải dữ liệu tổng quan cho dashboard
function loadDashboardData() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Hiển thị tổng số người dùng, khóa học và đánh giá
  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalCourses").textContent = courses.length;
  document.getElementById("totalReviews").textContent = reviews.length; // Cập nhật tổng số đánh giá

  // Tính tổng doanh thu
  let totalRevenue = 0;
  users.forEach((user) => {
    user.purchasedCourses?.forEach((course) => {
      const coursePrice = parseFloat(course.price); // Chuyển đổi giá sang số thực
      if (!isNaN(coursePrice)) {
        totalRevenue += coursePrice; // Chỉ cộng nếu giá trị hợp lệ
      }
    });
  });

  // Hiển thị tổng doanh thu
  document.getElementById(
    "totalRevenue"
  ).textContent = `${totalRevenue.toLocaleString("vi-VN")}đ`;
}

// Tải dữ liệu bảng người dùng
function loadUserTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const table = document.getElementById("userTable");
  table.innerHTML = ""; // Reset bảng mỗi lần gọi

  // Lọc bỏ tài khoản admin
  const filteredUsers = users.filter((user) => user.role !== "admin");

  if (filteredUsers.length === 0) {
    // Hiển thị thông báo nếu không có người dùng
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" style="text-align: center;">Không có dữ liệu người dùng</td>`;
    table.appendChild(row);
    return;
  }

  // Hiển thị danh sách người dùng
  filteredUsers.forEach((user) => {
    if (user.purchasedCourses && user.purchasedCourses.length > 0) {
      user.purchasedCourses.forEach((course) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name || user.email}</td>
          <td>${user.email}</td>
          <td>${course.courseName}</td>
          <td>${new Date(course.purchaseDate).toLocaleDateString()}</td>
          <td>${formatCurrency(course.price)}</td>
        `;
        table.appendChild(row);
      });
    } else {
      // Hiển thị nếu người dùng chưa mua khóa học
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name || user.email}</td>
        <td>${user.email}</td>
        <td>Chưa mua khóa học</td>
        <td>-</td>
        <td>0đ</td>
      `;
      table.appendChild(row);
    }
  });
}

// Định dạng số tiền theo kiểu Việt Nam
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return "0đ";
  return parseInt(amount).toLocaleString("vi-VN") + "đ";
}

// Tải dữ liệu bảng khóa học
function loadCourseTable() {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  populateTable(
    "courseTable",
    courses,
    (course) => `
      <td>${course.title}</td>
      <td>${course.price.toLocaleString()}đ</td>
      <td>${course.instructor}</td>
      <td>
        <button class="btn btn-edit" data-id="${course.id}">Sửa</button>
        <button class="btn btn-delete" data-id="${course.id}">Xóa</button>
      </td>
    `
  );
}

// Tải dữ liệu bảng hoạt động
function loadActivityTable() {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  const table = document.getElementById("activityTable");
  table.innerHTML = "";

  // Hiển thị danh sách hoạt động
  activities.forEach((activity) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(activity.time).toLocaleString()}</td>
      <td>${activity.user}</td>
      <td>${activity.action}</td>
      <td>${activity.details}</td>
    `;
    table.appendChild(row);
  });
}

// Xử lý sự kiện xóa khóa học
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const courseId = e.target.getAttribute("data-id");
    let courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (!courses.some((course) => course.id === parseInt(courseId))) {
      alert("Khóa học không tồn tại!");
      return;
    }

    // Xóa khóa học và cập nhật localStorage
    courses = courses.filter((course) => course.id !== parseInt(courseId));
    localStorage.setItem("courses", JSON.stringify(courses));
    alert("Khóa học đã được xóa!");
    location.reload();
  }
});

// Xử lý sự kiện chỉnh sửa khóa học
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const courseId = e.target.getAttribute("data-id");
    // const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const course = courses.find((course) => course.id === parseInt(courseId));

    if (course) {
      const newName = prompt("Tên khóa học mới:", course.name);
      if (newName) {
        // Cập nhật tên khóa học và lưu lại
        course.name = newName;
        localStorage.setItem("courses", JSON.stringify(courses));
        alert("Đã cập nhật tên khóa học!");
        location.reload();
      }
    }
  }
});

// Kiểm tra và sửa dữ liệu courses
let courses = JSON.parse(localStorage.getItem("courses")) || [];
courses.forEach((course) => {
  if (!course.price || isNaN(parseFloat(course.price))) {
    course.price = 0; // Gán giá trị mặc định nếu không hợp lệ
  }
});
localStorage.setItem("courses", JSON.stringify(courses));

// Kiểm tra và sửa dữ liệu users
const users = JSON.parse(localStorage.getItem("users")) || [];
users.forEach((user) => {
  user.purchasedCourses?.forEach((course) => {
    if (!course.price || isNaN(parseFloat(course.price))) {
      course.price = 0; // Gán giá trị mặc định nếu không hợp lệ
    }
  });
});
localStorage.setItem("users", JSON.stringify(users));

document.addEventListener("DOMContentLoaded", () => {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const tableBody = document.querySelector("#course-table tbody");

  if (courses && tableBody) {
    courses.forEach((course, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${course.title}</td>
        <td>${course.price}</td>
        <td>${course.instructor}</td>
      `;
      tableBody.appendChild(row);
    });
  }
});
