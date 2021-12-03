var tableBody = document.getElementById("table-body");
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
<td> ${loadingSpinner.innerHTML} </td>
`;

const updateTable = () => {
  tableBody.appendChild(loadingDataRow);

  /* GET ALL REPORTS */
  fetch("http://localhost:4000/api/lists")
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      data.forEach((record) => {
        var ReportJsonDate = record.reported_at;
        var ReportParsedDate = new Date(parseInt(ReportJsonDate.substr(6)));
        var ReportFinalDate = ReportParsedDate.toLocaleDateString();
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td data-label="Reported date">${ReportFinalDate}</td>
          <td data-label="Victim name">${record.username}</td>
          <td data-label="Crime type">${record.crime_type}</td>
          <!-- Description PopUp Starts -->
          <td data-label="Description">
            <button
              onclick="document.getElementById('id01').style.display='block'"
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
          <td data-label="Status">${record.status}</td>
          `;
        tableBody.appendChild(tr);
      });
    });
};

updateTable();
