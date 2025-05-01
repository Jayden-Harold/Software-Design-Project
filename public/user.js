const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Toggle Mobile Menu
menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});

const bookings = document.querySelector("#bookings-img");
const maintenance = document.querySelector("#maintenance-img");

bookings.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "user_bookings.html"
})

maintenance.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "user_maintenance.html"
})

