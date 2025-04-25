const padel         = document.querySelector("#padel-img");
const soccer        = document.querySelector("#soccer-img");
const netball       = document.querySelector("#netball-img");
const cricket       = document.querySelector("#cricket-img");
const basketball    = document.querySelector("#basketball-img");
const swim          = document.querySelector("#swimming-img");
const hockey        = document.querySelector("#hockey-img");

const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

// Toggle Mobile Menu
menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
});

padel.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="padel.html"
});

soccer.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="soccer.html"
});

netball.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="netball.html"
});

cricket.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="cricket.html"
});

basketball.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="basketball.html"
});

swim.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="swimming.html"
});

hockey.addEventListener("click", (e) => {
    e.preventDefault;
    window.location.href="hockey.html";
});