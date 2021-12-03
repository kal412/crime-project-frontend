var reportForm = document.getElementById("report-form");
var user = document.getElementById("user");
var date = document.getElementById("date");
var description = document.getElementById("description");
var category = document.getElementById("category");
var userCredentials = { token: "", username: "", id: "", auth: false };
var logOut = document.getElementById("log-out");

/* CHECK FOR TOKEN AND REDIRECT TO SIGNIN PAGE IF NOT AVAILABLE */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
  user.innerText = userCredentials.username;
} else {
  window.location.replace("/signin.html");
}

/* LOG OUT AND CLEAR TOKEN */
logOut.addEventListener("click", () => {
  sessionStorage.removeItem("userCredential");
  window.location.replace("/signin.html");
});

/* GET CRIME TYPES FROM DATABASE FOR DROPDOWN MENU */
fetch("http://localhost:4000/api/crimes", {
  headers: {
    Authorization: `Bearer ${userCredentials.token}`,
  },
})
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

/* POST REPORT DETAILS ON DATABASE REPORTS TABLE */
reportForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    reported_at: date.value,
    description: description.value,
    crime_type: category.value,
    user_id: userCredentials.id,
  };
  fetch("http://localhost:4000/api/reports/new", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
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
});
