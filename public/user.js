const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Toggle Mobile Menu
menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});

const bookings = document.querySelector("#bookings-img");
const maintenance = document.querySelector("#maintenance-img");
const notifications = document.querySelector("#notifications-img");
const events = document.querySelector("#events-img");

bookings.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "user_bookings.html"
})

maintenance.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "user_maintenance.html"
})

events.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "events.html"
})

notifications.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "notifications.html"
})