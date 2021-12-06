var registerForm = document.getElementById("register-form");
var firstName = document.getElementById("fname");
var lastName = document.getElementById("lname");
var email = document.getElementById("email");
var username = document.getElementById("username");
var password = document.getElementById("password");

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
    role: 333,
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
