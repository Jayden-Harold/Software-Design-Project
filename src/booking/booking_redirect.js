//redirect user to booking page
const book = document.querySelector("#book-btn2");

book.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.assign("booking.html");
});
