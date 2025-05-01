document.getElementById("event-btn").addEventListener("click", (e) => {
    e.preventDefault;
    document.querySelector(".modal-event").showModal();
})

const close_btn = document.querySelector(".close-btn");

close_btn.addEventListener("click", (e) => {
    e.preventDefault;
    document.querySelector(".modal-event").close();
})