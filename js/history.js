var tableBody = document.getElementById("table-body");
var user = document.getElementById("user");
var userCredentials = {
  token: "",
  refreshToken: "",
  username: "",
  id: "",
  role: "",
  auth: false,
};
var logOut = document.getElementById("log-out");
var loadingSpinner = document.createElement("span");
loadingSpinner.innerHTML = `
    <div class="loadingio-spinner-spinner-k19t5qqx9v">
      <div class="ldio-s0ew1rl6mvq">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
`;
var loadingDataRow = document.createElement("tr");
loadingDataRow.innerHTML = `
<td> ${loadingSpinner.innerHTML} </td>
<td> ${loadingSpinner.innerHTML} </td>
<td> ${loadingSpinner.innerHTML} </td>
<td> ${loadingSpinner.innerHTML} </td>
`;

/* CHECK FOR TOKEN AND REDIRECT TO SIGNIN PAGE IF NOT AVAILABLE */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
  user.innerText = userCredentials.username;

  // CHECK IF THE USER IS USER
  if (userCredentials.role !== 111) {
    window.location.replace("/admin.html");
  }
} else {
  window.location.replace("/signin.html");
}

/* POST REFRESH TOKEN AND UPDATE TOKEN */
let data = {
  token: userCredentials.refreshToken,
};
fetch("http://localhost:4000/api/auth/refresh", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((result) => {
    userCredentials.token = result;
    console.log("Success:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

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

const updateTable = () => {
  tableBody.appendChild(loadingDataRow);

  /* GET CRIME REPORTS REPORTED BY THE USER */
  fetch(`http://localhost:4000/api/lists/${userCredentials.username}`, {
    headers: {
      Authorization: `Bearer ${userCredentials.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      data.forEach((record) => {
        var reportJsonDate = record.reported_at;
        var reportFinalDate = moment(reportJsonDate).format("YYYY-MM-DD");
        const tr = document.createElement("tr");
        const insertDots = (text) => {
          return text.slice(0, 15) + (text.length > 15 ? "..." : "");
        };
        tr.innerHTML = `
        <td> ${reportFinalDate} </td>
        <td> ${record.crime_type} </td>
        <td> ${insertDots(record.description)} </td>
        <td> ${record.status} </td>
        `;
        tableBody.appendChild(tr);
      });
    });
};

updateTable();
