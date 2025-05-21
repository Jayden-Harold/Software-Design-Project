const maintenance = document.getElementById('maintenance-img');
const notifications = document.getElementById('notifications-img');

// event listener to redirect the staff to the staff maintenance page
maintenance.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "staff_maintenance.html"
})

// event listener to redirect the staff to the notifications page
notifications.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href = "notifications.html"
})
