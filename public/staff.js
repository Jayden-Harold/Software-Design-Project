const maintenance = document.getElementById('maintenance-img');
const notifications = document.getElementById('notifications-img');

maintenance.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "staff_maintenance.html"
})

notifications.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "notifications.html"
})
