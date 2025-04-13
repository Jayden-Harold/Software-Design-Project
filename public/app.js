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
      client_id: "665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com",
      callback: handleCredentialResponse 
    });
  
    google.accounts.id.renderButton(
      document.getElementById("googlesignup"),
      {
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "pill",
        width: 250
      }
    );

    google.accounts.id.renderButton(
        document.getElementById("googlesignin"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width: 250
        }
      );

  };

//fetches token in order to extract in
  function handleCredentialResponse(response) {
    const token = response.credential; //stores user's info from google
  
    const userInfo = parseJwt(token);
    console.log("User Name:", userInfo.name);
  
    // Send token to your backend to request verification
    fetch("https://green-smoke-0f073e403.6.azurestaticapps.net/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Server response:", data);
      })
      .catch(error => {
        console.error("Error verifying token:", error); 
        //in case something goes on
      });
  }
  
  //takes a JWT token, from Google, and decodes it to reveal its payload, which holds the users information.
  function parseJwt(token) {
    //JWT Token has format xxxxx.yyyyy.zzzzz, we want the yyyy part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const jwt = require('jsonwebtoken');

  async function handleGoogleSignin(idToken) {
    //verify GoogleID token
    const googleUser  = await verifyGoogleToken(idToken);

    //check if user exits
    let user = await database.query(
      "SELECT UserId,Name, Role FROM Users WHERE GoogleSubjectId = @sub",
      {sub: googleUser.sub}
    );

    //if user doesn't exist, create them
    if(!user){
      user = await database.query(
        "INSERT INTO Users (GoogleSubjectId, Name) OUTPUT inserted.* VALUES (@sub, @name)",
        { sub: googleUser.sub, name: googleUser.name }
      );
    }
    //generate a JWT token (for both new and existing users)
  const token = parseJwt.sign(
    {userId: user.UserId, 
      role: user.Role},
      process.env.JWT_SECRET,
      { expiresIn: '1h'}
  );

  return { users, token};
  }
  

  

