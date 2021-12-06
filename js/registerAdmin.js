var registerForm = document.getElementById("register-form");
var firstName = document.getElementById("fname");
var lastName = document.getElementById("lname");
var email = document.getElementById("email");
var username = document.getElementById("username");
var password = document.getElementById("password");
var userCredentials = {
  token: "",
  refreshToken: "",
  username: "",
  id: "",
  role: "",
  auth: false,
};
var logOut = document.getElementById("log-out");
var user = document.getElementById("user");

/* CHECK FOR TOKEN AND REDIRECT TO SIGNIN PAGE IF NOT AVAILABLE */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
  user.innerText = userCredentials.username;

  //CHECK IF THE USER IS SUPERADMIN
  if (userCredentials.role !== 111) {
    window.location.replace("/admin.html");
  }
} else {
  window.location.replace("/signin.html");
}

/* LOG OUT AND CLEAR TOKEN */
logOut.addEventListener("click", () => {
  fetch("http://localhost:4000/api/auth/logout", {
    method: "delete",
    headers: {
      Authorization: `Bearer ${userCredentials.refreshToken}`,
    },
  })
    .then((response) => console.log(response))
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  sessionStorage.removeItem("userCredentials");
  window.location.replace("/signin.html");
});

/* VALIDATE FORM */
const validateForm = () => {
  let isFormValidated = false;

  if (firstName.value == "") alert("Please enter your first name");
  if (lastName.value == "") alert("Please enter your last name");
  if (email.value == "") alert("Please enter a valid email address");
  if (username.value == "") alert("Please enter a username");
  if (password.value == "" || password.value.length < 8)
    alert("Please enter 8 characters or long password");
  if (
    firstName.value != "" &&
    lastName.value != "" &&
    email.value != "" &&
    username.value != "" &&
    password.value != "" &&
    password.value.length > 8
  )
    isFormValidated = true;
};

/* POST USER INFORMATION IN DATABASE USERS TABLE */
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    fname: firstName.value,
    lname: lastName.value,
    email: email.value,
    username: username.value,
    password: password.value,
    role: 222,
  };
  if (!validateForm()) return;
  else {
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
  }
});
