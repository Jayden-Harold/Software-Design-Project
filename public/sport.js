const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Toggle Mobile Menu
menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});


const book = document.querySelector("#book-btn2");

// event listener to redirect user to bookings page when the click "book" in the nav bar
book.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="booking.html";
});

