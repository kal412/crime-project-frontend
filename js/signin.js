var signInForm = document.getElementById("signin-form");
var username = document.getElementById("username");
var password = document.getElementById("password");
var userCredentials = {
  token: "",
  refreshToken: "",
  username: "",
  id: "",
  auth: false,
};

/* CHECK FOR TOKEN */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
}

/* SIGN IN IF USER EXISTS */
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    username: username.value,
    password: password.value,
  };
  fetch("http://localhost:4000/api/auth/signin", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      userCredentials = result;
      sessionStorage.setItem(
        "userCredentials",
        JSON.stringify(userCredentials)
      );
      window.location.replace("/user.html");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
