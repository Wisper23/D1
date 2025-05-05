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
// Tải dữ liệu tổng quan cho dashboard
function loadDashboardData() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Hiển thị tổng số người dùng, khóa học và đánh giá
  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalCourses").textContent = courses.length;
  document.getElementById("totalReviews").textContent = reviews.length;

  // Tính tổng doanh thu từ các khóa học đã mua
  let totalRevenue = 0;

  users.forEach((user) => {
    if (user.purchasedCourses && Array.isArray(user.purchasedCourses)) {
      user.purchasedCourses.forEach((purchasedCourse) => {
        // Tìm khóa học tương ứng trong danh sách courses
        const course = courses.find(
          (c) =>
            c.id === purchasedCourse.id ||
            c.title === purchasedCourse.courseName
        );

        if (course) {
          // Chuyển đổi giá từ chuỗi định dạng "1.800.000đ" sang số
          const priceString = course.price.toString();
          const priceNumber = parseFloat(priceString.replace(/[^\d]/g, ""));

          if (!isNaN(priceNumber)) {
            totalRevenue += priceNumber;
          }
        }
      });
    }
  });

  // Hiển thị tổng doanh thu đã định dạng
  document.getElementById("totalRevenue").textContent =
    formatCurrency(totalRevenue);
}

// Hàm chuẩn hóa giá từ chuỗi định dạng tiền tệ
function normalizePrice(price) {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const numericValue = parseFloat(price.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  }
  return 0;
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "đ");
}

// Tải dữ liệu bảng người dùng
// Tải dữ liệu bảng người dùng
function loadUserTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const table = document.getElementById("userTable");
  table.innerHTML = ""; // Reset bảng mỗi lần gọi

  // Tạo header cho bảng
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th>Tên</th>
    <th>Email</th>
    <th>Khóa học đã mua</th>
    <th>Ngày mua</th>
    <th>Giá</th>
  `;
  table.appendChild(headerRow);

  // Lọc bỏ tài khoản admin (cả theo role và email)
  const filteredUsers = users.filter((user) => {
    return user.role !== "admin" && !user.email.includes("admin@");
  });

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
          <td>${formatCurrency(normalizePrice(course.price))}</td>
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

console.log("Tổng doanh thu tạm tính:", totalRevenue);

// Định dạng số tiền theo kiểu Việt Nam
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return "0đ";
  return parseInt(amount).toLocaleString("vi-VN") + "đ";
}

// Tải dữ liệu bảng khóa học
function loadCourseTable() {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  console.log(
    "Dữ liệu courses từ localStorage:",
    JSON.parse(localStorage.getItem("courses"))
  );
  console.log("Phần tử bảng:", document.getElementById("courseTable"));
  populateTable(
    "courseTable",
    courses,
    (course) => `
      <td>${course.name || course.title || "chua co ten"}</td>
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

/**
 * ADMIN DASHBOARD - QUẢN LÝ ĐÁNH GIÁ & TÌM KIẾM
 * Phiên bản cải tiến với:
 * 1. Quản lý đánh giá từ localStorage
 * 2. Tìm kiếm thông minh theo từng section
 * 3. Xử lý lỗi và thông báo rõ ràng
 */

document.addEventListener("DOMContentLoaded", function () {
  // ========== PHẦN 1: QUẢN LÝ ĐÁNH GIÁ ==========
  const reviewsList = document.getElementById("reviewsList");
  const totalReviewsElement = document.getElementById("totalReviews");

  // Hàm hiển thị đánh giá
  function renderReviews(reviewsData) {
    if (!reviewsList) return;

    reviewsList.innerHTML = "";

    if (reviewsData && reviewsData.length > 0) {
      reviewsData.forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";
        reviewItem.innerHTML = `
          <h4>${review.courseName || "Không có tên khóa học"}</h4>
          <div class="stars">${"★".repeat(review.stars)}${"☆".repeat(
          5 - review.stars
        )}</div>
          <p class="review-comment">${review.comment || "Không có nhận xét"}</p>
          <small>${review.userEmail || "Ẩn danh"} - ${new Date(
          review.date
        ).toLocaleDateString("vi-VN")}</small>
        `;
        reviewsList.appendChild(reviewItem);
      });
    } else {
      reviewsList.innerHTML = '<p class="no-reviews">Chưa có đánh giá nào</p>';
    }

    if (totalReviewsElement) {
      totalReviewsElement.textContent = reviewsData ? reviewsData.length : 0;
    }
  }

  // Lấy và hiển thị đánh giá ban đầu
  const initialReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  renderReviews(initialReviews);

  // ========== PHẦN 2: TÌM KIẾM THÔNG MINH ==========
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const keyword = this.value.trim().toLowerCase();
      const activeSection = getActiveSection();

      if (!activeSection) return;

      switch (activeSection.id) {
        case "dashboardContent":
          searchActivityTable(keyword);
          break;
        case "coursesContent":
          searchTable("courseTable", keyword, [0, 2]); // Tìm theo cột Tên và Giảng viên
          break;
        case "usersContent":
          searchTable("userTable", keyword, [0, 1, 2]); // Tìm theo Tên, Email, Khóa học
          break;
        case "reviewsContent":
          searchReviews(keyword);
          break;
        default:
          console.log("Section không hỗ trợ tìm kiếm");
      }
    });
  }

  // Hàm xác định section đang active
  function getActiveSection() {
    return (
      document.querySelector(".main-section[style='display: block;']") ||
      document.querySelector(".main-section.active")
    );
  }

  // Hàm tìm kiếm trong bảng hoạt động
  function searchActivityTable(keyword) {
    const table = document.getElementById("activityTable");
    if (!table) return;

    let hasResults = false;
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      if (row.querySelector("th")) return; // Bỏ qua header

      const cells = row.querySelectorAll("td");
      let isVisible = false;

      cells.forEach((cell, index) => {
        if (index < 4 && cell.textContent.toLowerCase().includes(keyword)) {
          isVisible = true;
        }
      });

      row.style.display = isVisible ? "" : "none";
      if (isVisible) hasResults = true;
    });

    showNoResults(hasResults, table);
  }

  // Hàm tìm kiếm trong các bảng (courses/users)
  function searchTable(tableId, keyword, searchColumns) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let hasResults = false;
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      if (row.querySelector("th")) return; // Bỏ qua header

      const cells = row.querySelectorAll("td");
      let isVisible = false;

      searchColumns.forEach((colIndex) => {
        if (
          cells[colIndex] &&
          cells[colIndex].textContent.toLowerCase().includes(keyword)
        ) {
          isVisible = true;
        }
      });

      row.style.display = isVisible ? "" : "none";
      if (isVisible) hasResults = true;
    });

    showNoResults(hasResults, table);
  }

  // Hàm tìm kiếm trong phần đánh giá
  function searchReviews(keyword) {
    if (!reviewsList) return;

    let hasResults = false;
    const reviews = reviewsList.querySelectorAll(".review-item");

    reviews.forEach((review) => {
      const courseName =
        review.querySelector("h4")?.textContent.toLowerCase() || "";
      const comment =
        review.querySelector(".review-comment")?.textContent.toLowerCase() ||
        "";
      const userEmail =
        review.querySelector("small")?.textContent.toLowerCase() || "";

      const isVisible =
        courseName.includes(keyword) ||
        comment.includes(keyword) ||
        userEmail.includes(keyword);

      review.style.display = isVisible ? "" : "none";
      if (isVisible) hasResults = true;
    });

    showNoResults(hasResults, reviewsList);
  }

  // Hiển thị thông báo khi không có kết quả
  function showNoResults(hasResults, container) {
    const existingMsg = container.querySelector(".no-results");
    if (existingMsg) existingMsg.remove();

    if (!hasResults) {
      const message = document.createElement("div");
      message.className = "no-results";
      message.textContent = "Không tìm thấy kết quả phù hợp";

      if (container.tagName === "TABLE") {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 10;
        cell.appendChild(message);
        row.appendChild(cell);
        container.querySelector("tbody")?.appendChild(row);
      } else {
        container.appendChild(message);
      }
    }
  }

  // ========== PHẦN 3: THEO DÕI THAY ĐỔI DỮ LIỆU ==========
  window.addEventListener("storage", function (e) {
    if (e.key === "reviews") {
      renderReviews(JSON.parse(e.newValue));
    }
  });
});
