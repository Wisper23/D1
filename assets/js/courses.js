// Hiệu ứng scroll mượt cho menu
const menuLinks = document.querySelectorAll("nav a");
menuLinks.forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault(); // chỉ chặn cuộn nội trang
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  });
});

// Popup giảm giá sau 30s
setTimeout(() => {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h3 class="title-popup">Ưu đãi đặc biệt!</h3>
            <p class="desc-popup">Giảm 30% cho tất cả khóa học khi đăng ký trong hôm nay.</p>
            <a href="#courses" class="btn cta">Đăng ký ngay</a>
        </div>
    `;
  document.body.appendChild(popup);

  const closePopup = document.querySelector(".close-popup");
  closePopup.addEventListener("click", () => {
    popup.remove();
  });
}, 3000);

// Thêm style cho popup
const style = document.createElement("style");
style.textContent = `
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .title-popup {
      font-size: 2.5rem;
      color: red;
    }
    
    .desc-popup {
      font-size: 2rem;
      margin: 20px 0;
      /* Tạo gradient */
      background: linear-gradient(45deg, #FF7A45, #2A3F84, #FFD700);
      background-size: 200% auto;
    
      /* Áp dụng gradient lên text */
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    
      /* Hiệu ứng chuyển động */
      animation: gradientShift 3s ease infinite;
    }
    
    @keyframes gradientShift {
    0% { background-position: 0% center; }
    100% { background-position: 100% center; }
    }

    .popup-content {
        margin: 0 auto;
        background: white;
        padding: 50px 30px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 15px;
        position: relative;
        max-width: 500px;
    }
    .close-popup {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 3rem;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Mở modal khi bấm nút đánh giá
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử cần thiết
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const reviewButtons = document.querySelectorAll(".btn.review-btn");
  const modal = document.getElementById("reviewModal");
  const closeModal = document.getElementById("closeModal");
  const submitReview = document.getElementById("submitReview");
  const starInput = document.getElementById("starInput");
  const commentInput = document.getElementById("commentInput");
  const reviewsList = document.getElementById("reviewsList");
  let currentCourseName = ""; // Biến lưu tên khóa học hiện tại

  // Xử lý sự kiện mở modal đánh giá
  reviewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      currentCourseName = this.getAttribute("data-course-name"); // Lấy tên khóa học
      modal.classList.remove("hidden");
      modal.querySelector(
        "h3"
      ).textContent = `Đánh giá khóa học: ${currentCourseName}`; // Hiển thị tên khóa học trong modal
    });
  });

  // Xử lý sự kiện đóng modal đánh giá
  closeModal.addEventListener("click", function () {
    modal.classList.add("hidden");
    resetReviewForm();
  });

  // Xử lý sự kiện gửi đánh giá
  submitReview.addEventListener("click", function () {
    const userName = localStorage.getItem("userName") || "Khach"; // Lấy tên người dùng từ localStorage
    const stars = parseInt(starInput.value, 10);
    const comment = commentInput.value.trim();

    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      window.location.href = "../pages/auth.html";
      return;
    }

    // Kiểm tra giá trị hợp lệ
    console.log("Stars:", stars, "Comment:", comment);
    if (!stars || stars < 1 || stars > 5 || !comment) {
      alert("Vui lòng nhập số sao từ 1 đến 5 và viết bình luận.");
      console.log(!stars, !comment);
      return;
    }

    // Tạo đối tượng đánh giá
    const review = {
      courseName: currentCourseName,
      userName: userName,
      stars: stars,
      comment: comment,
      timestamp: new Date().toISOString(),
    };

    // Hiển thị tên người dùng nếu đã đăng nhập
    const userInfo = document.getElementById("userInfo");
    const displayName = document.getElementById("displayUserName");

    if (isLoggedIn && userName !== "Khách") {
      userInfo.classList.remove("hidden");
      displayName.textContent = userName;
    }

    // Lấy các đánh giá đã lưu trong localStorage
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Thêm đánh giá mới vào mảng
    reviews.push(review);

    // Lưu lại mảng đánh giá vào localStorage
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // Tạo phần tử đánh giá mới
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");
    reviewItem.innerHTML = `
      <h4>${currentCourseName}</h4>
      <div class="stars">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</div>
      <p class="review-comment">${comment}</p>
    `;

    // Thêm đánh giá vào danh sách
    reviewsList.appendChild(reviewItem);

    // Cập nhật lại tổng đánh giá trong admin dashboard
    const totalReviews = document.getElementById("totalReviews");
    if (totalReviews) {
      totalReviews.textContent = reviews.length;
    } else {
      console.warn("Không tìm thấy phần tử #totalReviews");
    }

    // Đóng modal và reset form
    modal.classList.add("hidden");
    resetReviewForm();

    alert(
      `Cảm ơn bạn đã đánh giá khóa học "${currentCourseName}" với ${stars} sao và bình luận: "${comment}"`
    );
  });

  // Hàm reset form đánh giá
  function resetReviewForm() {
    starInput.value = "";
    commentInput.value = "";
  }

  // Kiểm tra trạng thái đăng nhập
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (isLoggedIn) {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  // Xử lý sự kiện đăng xuất
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    window.location.href = "./auth.html";
  });

  // Xử lý sự kiện cho nút "Đăng ký ngay"
  const enrollButtons = document.querySelectorAll(".btn.enroll");

  enrollButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      if (!isLoggedIn) {
        alert("Bạn cần đăng nhập để mua khóa học!");
        window.location.href = "../pages/auth.html"; // Chuyển hướng đến trang đăng nhập
      } else {
        const courseCard = this.closest(".courses-card");
        const courseName = courseCard.querySelector("h3").textContent.trim();
        const discountedPriceElement =
          courseCard.querySelector(".discounted-price");
        const amountText = discountedPriceElement
          ? discountedPriceElement.textContent.trim()
          : "0";

        localStorage.setItem("selectedCourse", courseName);
        localStorage.setItem("selectedCoursePrice", amountText);
        alert(`Bạn đã chọn mua khóa học: ${courseName}`);
        window.location.href = "../pages/checkout.html"; // Chuyển hướng đến trang thanh toán
      }
    });
  });

  // Tìm kiếm khóa học
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const courses = document.querySelectorAll(".courses-card");

    courses.forEach((course) => {
      const title = course.querySelector("h3").textContent.toLowerCase();
      if (title.includes(keyword) || keyword === "") {
        course.style.display = "block";
      } else {
        course.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const courses = [];
  document.querySelectorAll(".courses-card").forEach((card) => {
    const courseName = card.querySelector("h3").textContent.trim();
    const coursePrice = card.querySelector(".discounted-price")?.dataset.price;
    // Sửa tại đây - kiểm tra cả 2 class có thể có
    const instructorElement =
      card.querySelector(".instructor") || card.querySelector(".name-teacher");
    const instructor = instructorElement
      ? instructorElement.textContent.trim()
      : "Không rõ giảng viên";

    if (courseName && coursePrice) {
      courses.push({
        name: courseName,
        price: parseInt(coursePrice),
        instructor: instructor,
      });
    }
  });

  // Lưu danh sách khóa học vào localStorage
  localStorage.setItem("courses", JSON.stringify(courses));
});
