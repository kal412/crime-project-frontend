var tableBody = document.getElementById("table-body");
var user = document.getElementById("user");
var userCredentials = { token: "", username: "", id: "", auth: false };
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
if (localStorage.userCredentials) {
  userCredentials = JSON.parse(localStorage.userCredentials);
  user.innerText = userCredentials.username;
} else {
  window.location.replace("/signin.html");
}

/* LOG OUT AND CLEAR TOKEN */
logOut.addEventListener("click", () => {
  localStorage.removeItem("userCredential");
  window.location.replace("/signin.html");
});

const updateTable = () => {
  tableBody.appendChild(loadingDataRow);

  /* GET CRIME REPORTS REPORTED BY THE USER */
  fetch(`http://localhost:4000/api/lists/${userCredentials.username}`)
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      data.forEach((record) => {
        const tr = document.createElement("tr");
        const insertDots = (text) => {
          return text.slice(0, 15) + (text.length > 15 ? "..." : "");
        };
        tr.innerHTML = `
        <td> ${record.reported_at} </td>
        <td> ${record.crime_type} </td>
        <td> ${insertDots(record.description)} </td>
        <td> ${record.status} </td>
        `;
        tableBody.appendChild(tr);
      });
    });
};

updateTable();
