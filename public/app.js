const modal_signin = document.querySelector(".modal-signin");
const modal_signup = document.querySelector(".modal-signup");

const loginbtn = document.querySelector("#login-btn");
const registerbtn = document.querySelector("#register-btn");

const registerbtn2 = document.querySelector("#btn-1");

loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.showModal();
}
)