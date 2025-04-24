const residents = document.querySelector("#residents-img");
const staff = document.querySelector("#staff-img");
const bookings = document.querySelector("#bookings-img");

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