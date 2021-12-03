var registerForm = document.getElementById("register-form");
var firstName = document.getElementById("fname");
var lastName = document.getElementById("lname");
var email = document.getElementById("email");
var username = document.getElementById("username");
var password = document.getElementById("password");

/* POST USER INFORMATION IN DATABASE USERS TABLE */
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    fname: firstName.value,
    lname: lastName.value,
    email: email.value,
    username: username.value,
    password: password.value,
  };
  fetch("http://localhost:4000/api/auth/register", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      registerForm.reset();
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
