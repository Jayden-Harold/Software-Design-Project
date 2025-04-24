const residents = document.querySelector("#residents-img");
const staff = document.querySelector("#staff-img");
const bookings = document.querySelector("#bookings-img");

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