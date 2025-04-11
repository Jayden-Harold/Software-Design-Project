const modal_signin = document.querySelector(".modal-signin");
const modal_signup = document.querySelector(".modal-signup");

const loginbtn = document.querySelector("#login-btn");
const registerbtn = document.querySelector("#register-btn");

const registerbtn2 = document.querySelector("#btn-1");

const link2signin = document.querySelector("#link2signin");
const link2signup = document.querySelector("#link2signup");

const close_signin = document.querySelector(".close-signin");
const close_signup = document.querySelector(".close-signup");


loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.showModal();
}
)

registerbtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.showModal();
})

registerbtn2.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.showModal();
})

link2signup.addEventListener("click" , (e) => {
    e.preventDefault();
    modal_signin.close();
    modal_signup.showModal();
})

link2signin.addEventListener("click" , (e) => {
    e.preventDefault();
    modal_signup.close();
    modal_signin.showModal();
})

close_signin.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.close();
})

close_signup.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.close();
})

window.onload = function () {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: () => {} // Empty callback, nothing happens yet
    });
  
    google.accounts.id.renderButton(
      document.getElementById("googlesignup"),
      {
        theme: "outline",
        size: "large"
      }
    );

    google.accounts.id.renderButton(
        document.getElementById("googlesignin"),
        {
          theme: "outline",
          size: "large"
        }
      );

  };

