const book_btn = document.querySelector("#book-btn");
const modal_booking = document.querySelector(".modal-booking")

book_btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_booking.showModal();
});

const close_booking = document.querySelector(".close-booking");

close_booking.addEventListener("click", (e) => {
    modal_booking.close();
})