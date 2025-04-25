export function attachSportRedirects(document, window) {
  const mappings = {
    "#padel-img": "padel.html",
    "#soccer-img": "soccer.html",
    "#netball-img": "netball.html",
    "#cricket-img": "cricket.html",
    "#basketball-img": "basketball.html",
    "#swimming-img": "swimming.html",
    "#hockey-img": "hockey.html",
  };

  for (let selector in mappings) {
    let target = mappings[selector];
    let element = document.querySelector(selector);

    //If the element exists on the page:
    if (element) {
      element.addEventListener("click", function (event) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        window.location.assign(target); //location.assign for redirection
      });
    }
  }
}
