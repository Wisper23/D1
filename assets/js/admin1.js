document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử cần thiết
  const reviewsListAdmin = document.getElementById("reviewsList");

  // Lấy các đánh giá đã lưu trong localStorage
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // Kiểm tra và hiển thị các đánh giá
  if (reviews.length > 0) {
    reviews.forEach((review) => {
      const reviewItem = document.createElement("div");
      reviewItem.classList.add("review-item");
      reviewItem.innerHTML = `
            <h4>${review.courseName}</h4>
            <div class="stars">${"★".repeat(review.stars)}${"☆".repeat(
        5 - review.stars
      )}</div>
            <p class="review-comment">${review.comment}</p>
          `;
      reviewsListAdmin.appendChild(reviewItem);
    });

    // Cập nhật số lượng đánh giá trong admin
    const totalReviews = document.getElementById("totalReviews");
    totalReviews.textContent = reviews.length; // Cập nhật tổng số đánh giá
  } else {
    // Nếu không có đánh giá, hiển thị thông báo
    reviewsListAdmin.innerHTML = "<p>Chưa có đánh giá nào.</p>";
    const totalReviews = document.getElementById("totalReviews");
    totalReviews.textContent = "0"; // Nếu không có đánh giá, hiển thị là 0
  }
});

console.log(localStorage.getItem("reviews"));

// search course
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  // Tìm kiếm trong các bảng
  searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.toLowerCase();

    // Tìm các bảng trong admin
    const courseTable = document.getElementById("courseTable");
    const userTable = document.getElementById("userTable");
    const reviewsList = document.getElementById("reviewsList");

    // Tìm kiếm trong bảng khóa học
    searchInTable(courseTable, keyword);

    // Tìm kiếm trong bảng người dùng
    searchInTable(userTable, keyword);

    // Tìm kiếm trong phần đánh giá
    searchInReviews(reviewsList, keyword);
  });

  // Hàm tìm kiếm trong bảng
  function searchInTable(table, keyword) {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      let match = false;
      cells.forEach((cell) => {
        if (cell.textContent.toLowerCase().includes(keyword)) {
          match = true;
        }
      });

      // Hiển thị hoặc ẩn hàng dựa trên kết quả tìm kiếm
      if (match) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  // Hàm tìm kiếm trong phần đánh giá
  function searchInReviews(reviewsList, keyword) {
    const reviews = reviewsList.querySelectorAll(".review-item");
    reviews.forEach((review) => {
      const courseName = review.querySelector("h4").textContent.toLowerCase();
      const comment = review
        .querySelector(".review-comment")
        .textContent.toLowerCase();
      if (courseName.includes(keyword) || comment.includes(keyword)) {
        review.style.display = "";
      } else {
        review.style.display = "none";
      }
    });
  }
});
