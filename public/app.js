const modal_signin = document.querySelector(".modal-signin");
const modal_signup = document.querySelector(".modal-signup");

const loginbtn = document.querySelector("#login-btn");
const registerbtn = document.querySelector("#register-btn");
const registerbtn2 = document.querySelector("#btn-1");

const link2signin = document.querySelector("#link2signin");
const link2signup = document.querySelector("#link2signup");

const close_signin = document.querySelector(".close-signin");
const close_signup = document.querySelector(".close-signup");

// Modal triggers
loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.showModal();
});
registerbtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.showModal();
});
registerbtn2.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.showModal();
});
link2signup.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.close();
    modal_signup.showModal();
});
link2signin.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.close();
    modal_signin.showModal();
});
close_signin.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.close();
});
close_signup.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.close();
});

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googlesignup"),
        { theme: "outline", size: "large", text: "signup_with", shape: "pill", width: 250 }
    );
    google.accounts.id.renderButton(
        document.getElementById("googlesignin"),
        { theme: "outline", size: "large", text: "signin_with", shape: "pill", width: 250 }
    );
};

function handleCredentialResponse(response) {
    const token = response.credential;

    fetch("https://green-smoke-0f073e403.6.azurestaticapps.net/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.success) {
                localStorage.setItem("jwtToken", data.token);
                const role = data.user.Role.toLowerCase();
                if (role !== "admin") {
                    window.location.href = "dashboard_user.html";
                } else {
                    alert("Admins cannot access the dashboard.");
                }
            } else {
                alert("Authentication failed.");
            }
        })
        .catch(err => {
            console.error("Auth error:", err);
            alert("Something went wrong during sign-in.");
        });
}

