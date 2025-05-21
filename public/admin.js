const residents = document.querySelector("#residents-img");
const staff = document.querySelector("#staff-img");
const bookings = document.querySelector("#bookings-img");
const events = document.querySelector("#events-img");
const maintenance = document.querySelector("#maintenance-img");
const notifications = document.querySelector("#notifications-img");
//Handles the admin dashboard and its clickable directories
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Toggle Mobile Menu
menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});

residents.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "admin_resident.html";
})

staff.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "admin_staff.html";
})

bookings.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href="admin_bookings.html"
})

events.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href="admin_events.html"
})

maintenance.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href="admin_maintenance.html"
})

notifications.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="notifications.html"
})
