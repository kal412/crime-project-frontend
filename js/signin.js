var signInForm = document.getElementById("signin-form");
var username = document.getElementById("username");
var password = document.getElementById("password");
var passwordResetEnterEmail = document.getElementById(
  "password-reset-enter-email"
);
var passwordResetEnteredEmail = document.getElementById(
  "password-reset-entered-email"
);
var passwordResetEnterPassword = document.getElementById(
  "password-reset-enter-password"
);
var passwordResetEnteredPassword = document.getElementById(
  "password-reset-entered-password"
);
var userCredentials = {
  token: "",
  refreshToken: "",
  username: "",
  id: "",
  role: "",
  auth: false,
};

/* CHECK FOR TOKEN */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
}

/* FORM VALIDATION */
const validateSigninForm = () => {
  let isFormValidated = false;
  if (username.value == "") alert("Username field can't be empty");
  if (password.value == "") alert("Password field can't be empty");
  if (username.value != "" && password.value != "") isFormValidated = true;
  return isFormValidated;
};

const validateEnterEmailForm = () => {
  let isFormValidated = false;
  if (passwordResetEnteredEmail.value == "")
    alert("First enter email you have registered with");
  if (passwordResetEnteredEmail.value != "") isFormValidated = true;
  return isFormValidated;
};

const validateEnterPasswordForm = () => {
  let isFormValidated = false;
  if (
    passwordResetEnteredPassword.value == "" ||
    passwordResetEnteredPassword.value.length < 8
  )
    alert("Please enter 8 characters or long password");
  if (
    passwordResetEnteredPassword.value != "" &&
    passwordResetEnteredPassword.value.length >= 8
  )
    isFormValidated = true;
  return isFormValidated;
};

/* SIGN IN IF USER EXISTS */
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    username: username.value,
    password: password.value,
  };
  if (!validateSigninForm()) return;
  else {
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
        if (userCredentials.role == 111 || userCredentials.role == 222) {
          window.location.replace("/admin.html");
        } else {
          window.location.replace("/user.html");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

/* UPDATE USER PASSWORD */
passwordResetEnterEmail.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateEnterEmailForm()) return;
  else {
    document.getElementById("pr-wrap").classList.remove("show-pass-reset");
    let res = await fetch(
      `http://localhost:4000/api/users/${passwordResetEnteredEmail.value}`
    ).catch((err) => console.log(err));
    if (res.status != 404) {
      userData = await res.json();
      document.querySelector(".ep-wrap").classList.add("show-enter-password");
      passwordResetEnterPassword.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateEnterPasswordForm()) return;
        else {
          changePassword(userData.id);
          document
            .getElementById("ep-wrap")
            .classList.remove("show-enter-password");
        }
      });
    } else {
      alert("No user registered with following email");
    }
  }
});

// FUNCTION CALL AFTER USER ENTERS NEW PASSWORD
function changePassword(userId) {
  let data = {
    password: passwordResetEnteredPassword.value,
  };
  fetch(`http://localhost:4000/api/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
