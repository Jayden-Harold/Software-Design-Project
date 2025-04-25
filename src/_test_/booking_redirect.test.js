import { fireEvent } from "@testing-library/dom";

describe("Booking Button", () => {
    beforeEach(()=>{
        document.body.innerHTML = `<button id="book-btn2">Book Now</button>`;
      //window.location = { href: "" };
      jest.resetModules();
      require("../booking/booking_redirect.js");
    });
  it("redirects to booking.html when clicked", () => {
    const bookButton = document.querySelector("#book-btn2");
    delete window.location;
    window.location = { assign: jest.fn() };
    fireEvent.click(bookButton);
    expect(window.location.assign).toHaveBeenCalledWith("booking.html");
  });
});
