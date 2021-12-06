var reportForm = document.getElementById("report-form");
var user = document.getElementById("user");
var date = document.getElementById("date");
var phoneNumber = document.getElementById("phone-number");
var address = document.getElementById("address");
var description = document.getElementById("description");
var category = document.getElementById("category");
var userCredentials = {
  token: "",
  refreshToken: "",
  username: "",
  id: "",
  role: "",
  auth: false,
};
var logOut = document.getElementById("log-out");

/* CHECK FOR TOKEN AND REDIRECT TO SIGNIN PAGE IF NOT AVAILABLE */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
  user.innerText = userCredentials.username;

  // CHECK IF THE USER IS USER
  if (userCredentials.role === 222) {
    window.location.replace("/admin.html");
  }
} else {
  window.location.replace("/signin.html");
}

/* POST REFRESH TOKEN AND UPDATE ACCESS TOKEN */

const refreshToken = async () => {
  try {
    fetch("http://localhost:4000/api/auth/refresh", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: userCredentials.refreshToken }),
    })
      .then((response) => response.json())
      .then((result) => {
        userCredentials.token = result.accessToken;
        sessionStorage.setItem(
          "userCredentials",
          JSON.stringify(userCredentials)
        );
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (err) {
    console.log(err);
  }
};

refreshToken();
const interval = setInterval(() => {
  refreshToken();
}, 18000000);

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

/* GET CRIME TYPES FROM DATABASE FOR DROPDOWN MENU */
fetch("http://localhost:4000/api/crimes")
  .then((data) => {
    return data.json();
  })
  .then((crimes) => {
    crimes.forEach((element) => {
      const node = document.createElement("option");
      node.value = element.type;
      node.innerText = element.type;
      category.appendChild(node);
    });
  });
category.addEventListener("change", () => {
  category.value = category.options[category.selectedIndex].text;
});

/* VALIDATE FORM */
const validateRegisterForm = () => {
  let isFormValidated = false;
  if (date.value == "") alert("Please select a date");
  if (phoneNumber.value == "" || phoneNumber.value.length != 10)
    alert("Please enter a valid phone number");
  if (address.value == "") alert("Please enter your address");
  if (description.value == "")
    alert("Please enter detailed description of crime");
  if (
    date.value != "" &&
    phoneNumber.value != "" &&
    phoneNumber.value.length == 10 &&
    address.value != "" &&
    description.value != ""
  )
    isFormValidated = true;
  return isFormValidated;
};

/* POST REPORT DETAILS ON DATABASE REPORTS TABLE */
reportForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    reported_at: date.value,
    description: description.value,
    crime_type: category.value,
    user_id: userCredentials.id,
  };
  if (!validateRegisterForm()) return;
  else {
    fetch("http://localhost:4000/api/reports/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCredentials.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        reportForm.reset();
        console.log("Success:", result);
        alert("Report has been submitted successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
