const { attachSportRedirects } =require ("../booking/sport_redirect");

describe("attachSportRedirects", () => {
  let mockDocument, mockWindow;

  beforeEach(() => {
    mockWindow = {
      location: {
        href: ""
      }
    };

    const createMockElement = () => {
      const el = {
        addEventListener: jest.fn((event, handler) => {
          el._handler = handler;
        }),
        _handler: null,
      };
      return el;
    };

    mockDocument = {
      querySelector: jest.fn((selector) => {
        const mockElements = {
          "#padel-img": createMockElement(),
          "#soccer-img": createMockElement(),
          "#netball-img": createMockElement(),
          "#cricket-img": createMockElement(),
          "#basketball-img": createMockElement(),
          "#swimming-img": createMockElement(),
          "#hockey-img": createMockElement(),
        };
        return mockElements[selector];
      })
    };
  });

  it("should set up event listeners and redirect on click", () => {
    attachSportRedirects(mockDocument, mockWindow);

    // Simulate clicking on padel image
    const padelEl = mockDocument.querySelector("#padel-img");
    const mockEvent = { preventDefault: jest.fn() };

    padelEl._handler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockWindow.location.href).toBe("padel.html");
  });

  it("should handle soccer click", () => {
    attachSportRedirects(mockDocument, mockWindow);

    const soccerEl = mockDocument.querySelector("#soccer-img");
    const mockEvent = { preventDefault: jest.fn() };

    soccerEl._handler(mockEvent);
    expect(mockWindow.location.href).toBe("soccer.html");
  });
});
