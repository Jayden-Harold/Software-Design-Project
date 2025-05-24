import {attachSportRedirects } from "../booking/sport_redirect";

describe("Sport Redirects", () => {
  let mockWindow;

  beforeEach(() => {
    // Setup mock window.location
    mockWindow = {
      location: {
        assign: jest.fn()
      }
    };

    // Inject HTML elements into the DOM
    document.body.innerHTML = `
      <img id="padel-img" />
      <img id="soccer-img" />
    `;
  });

  it("should redirect to padel.html when clicked", () => {
    attachSportRedirects(document, mockWindow);

    const padelEl = document.querySelector("#padel-img");

    // Simulate the click
    const event = new Event("click");
    Object.defineProperty(event, "preventDefault", { value: jest.fn() });

    padelEl.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockWindow.location.assign).toHaveBeenCalledWith("padel.html");
  });

  it("should redirect to soccer.html when clicked", () => {
    attachSportRedirects(document, mockWindow);

    const soccerEl = document.querySelector("#soccer-img");

    const event = new Event("click");
    Object.defineProperty(event, "preventDefault", { value: jest.fn() });

    soccerEl.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockWindow.location.assign).toHaveBeenCalledWith("soccer.html");
  });
});
