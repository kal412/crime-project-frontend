var tableBody = document.getElementById("table-body");
var loadingSpinner = document.createElement("span");
var filterButton = document.getElementById("filter-button");
var filterSearch = document.getElementById("filter-search");
var modalDialog = document.getElementById("record-modal-dialog-box");
var modalTitle = document.getElementById("record-dialog-box-title");
var modalStatus = document.getElementById("record-dialog-box-status");
var modalDesc = document.getElementById("record-dialog-box-desc");
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
var showAdminRegister = document.getElementById("admin-register");
var filterValue = "";
var recordList = [];
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
<td> ${loadingSpinner.innerHTML} </td>
`;

/* CHECK FOR TOKEN AND REDIRECT TO SIGNIN PAGE IF NOT AVAILABLE */
if (sessionStorage.userCredentials) {
  userCredentials = JSON.parse(sessionStorage.userCredentials);
  user.innerText = userCredentials.username;

  // CHECK IF THE USER IS ADMIN
  if (userCredentials.role === 333) {
    window.location.replace("/user.html");
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

/* SHOW ADMIN REGISTER IF LOGGED BY SUPER ADMIN */
if (userCredentials.role == 111) {
  showAdminRegister.innerHTML = "Admin Register";
} else {
  showAdminRegister.innerHTML = "";
}

/* GET REPORT ACCORDING TO FILTER SEARCH */
filterButton.addEventListener("click", () => {
  filterValue = filterSearch.value;
  const updateTable = () => {
    tableBody.appendChild(loadingDataRow);

    fetch(`http://localhost:4000/api/lists/${filterValue}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCredentials.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        recordList = data;
        tableBody.innerHTML = "";

        data.forEach((record) => {
          recordList = data;
          var reportJsonDate = record.reported_at;
          var reportFinalDate = moment(reportJsonDate).format("YYYY-MM-DD");
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td data-label="Reported date">${reportFinalDate}</td>
            <td data-label="Victim name">${record.username}</td>
            <td data-label="Crime type">${record.crime_type}</td>
            <!-- Description PopUp Starts -->
            <td data-label="Description">
              <button
                onclick= ' showReport(${record.id})'
                class="w3-button"
                style="border: 2px solid #000"
              >
                Read Here
              </button>
              <div
                id="id01"
                class="w3-modal"
                style="width: 80%; margin-left: 20em"
              >
                <div class="w3-modal-content">
                  <div class="w3-container" style="margin: 100px; height: 50vh">
                    <span
                      onclick="document.getElementById('id01').style.display='none'"
                      class="w3-button w3-display-topright"
                      >&times;</span
                    >
                    <p>${record.description}</p>
                  </div>
                </div>
              </div>
            </td>
            <!-- Description PopUp Ends -->
            <td data-label="Status">
            ${record.status}
            <span>
            <button class='status-button' onclick='toggleReport(${record.id},"accept")' ><i style="font-size: 15px; margin: 5px" class="fa fa-check-circle"></i></button>
            <button class='status-button' onclick='toggleReport(${record.id},"reject")'><i style="font-size: 15px; margin: 5px" class="fa fa-times-circle"></i></button>
            </span>          
            </td>
            `;
          tableBody.appendChild(tr);
        });
      });
  };
  updateTable();
});

/* GET ALL REPORTS */
const updateTable = () => {
  tableBody.appendChild(loadingDataRow);

  fetch("http://localhost:4000/api/lists", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userCredentials.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      data.forEach((record) => {
        recordList = data;
        var reportJsonDate = record.reported_at;
        var reportFinalDate = moment(reportJsonDate).format("YYYY-MM-DD");
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td data-label="Reported date">${reportFinalDate}</td>
          <td data-label="Victim name">${record.username}</td>
          <td data-label="Crime type">${record.crime_type}</td>
          <!-- Description PopUp Starts -->
          <td data-label="Description">
            <button
              onclick= ' showReport(${record.id})'
              class="w3-button"
              style="border: 2px solid #000"
            >
              Read Here
            </button>
            <div
              id="id01"
              class="w3-modal"
              style="width: 80%; margin-left: 20em"
            >
              <div class="w3-modal-content">
                <div class="w3-container" style="margin: 100px; height: 50vh">
                  <span
                    onclick="document.getElementById('id01').style.display='none'"
                    class="w3-button w3-display-topright"
                    >&times;</span
                  >
                  <p>${record.description}</p>
                </div>
              </div>
            </div>
          </td>
          <!-- Description PopUp Ends -->
          <td data-label="Status">
          ${record.status}
          <span>
          <button class='status-button' onclick='toggleReport(${record.id},"accept")' ><i style="font-size: 15px; margin: 5px" class="fa fa-check-circle"></i></button>
          <button class='status-button' onclick='toggleReport(${record.id},"reject")'><i style="font-size: 15px; margin: 5px" class="fa fa-times-circle"></i></button>
          </span>          
          </td>
          `;
        tableBody.appendChild(tr);
      });
    });
};

updateTable();

/* CHANGE REPORT STATUS */

function toggleReport(recordId, statusTo) {
  let status = "Rejected";
  if (statusTo === "accept") status = "Accepted";

  let data = {
    status: status,
  };
  fetch(`http://localhost:4000/api/reports/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userCredentials.token}`,
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

/* FUNCTION TO SET DETAIL IN MODAL DIALOG BOX */
function setRecordInModalDialog(title, status, desc) {
  modalTitle.innerText = title;
  modalStatus.innerText = status;
  modalDesc.innerText = desc;
}

/* FUNCTION TO SHOW REPORT DETAILS IN MODAL DIALOG */
function showReport(id) {
  let index = recordList.findIndex((record) => record.id === id);
  console.log(recordList[index]);

  //SHOW MODAL DIALOG
  setRecordInModalDialog(
    recordList[index].crime_type,
    recordList[index].status,
    recordList[index].description
  );
  modalDialog.style.display = "block";
}

//HIDE MODAL DIALOG
function hideRecordModalDialog() {
  modalDialog.style.display = "none";
  setRecordInModalDialog("", "", "");
}
