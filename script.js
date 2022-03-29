const loadBtn = document.getElementById("load-btn");
var jsonData;
var columns = [];

fetch("./data.json")
  .then((Response) => Response.json())
  .then((data) => (jsonData = data));

loadBtn.addEventListener("click", function () {
  if (loadBtn.innerHTML === "Load Data") {
    loadBtn.innerHTML = "Refresh Data";
  } else {
    loadBtn.addEventListener("click", refreshData);
  }
  return loadData();
});

function loadData() {
  for (let i = 0; i < jsonData.length; i++) {
    for (let key in jsonData[i]) {
      if (columns.indexOf(key) === -1) {
        columns.push(key);
      }
    }
  }
  //Creating HTML table element
  var tableData = document.createElement("table");

  //Creating header of the HTML table
  var tr = tableData.insertRow(-1);

  for (let i = 0; i <= columns.length; i++) {
    //header
    let th = document.createElement("th");
    if (columns[i] !== undefined) {
      th.innerHTML = columns[i];
      tr.appendChild(th);
    } else {
      th.innerHTML = "Operations";
      tr.appendChild(th);
    }
  }

  // Adding JSON data in table
  for (let i = 0; i < jsonData.length; i++) {
    tr = tableData.insertRow(-1);
    for (let j = 0; j <= columns.length; j++) {
      let td = tr.insertCell(-1);
      if (columns[j] !== undefined) {
        td.innerHTML = jsonData[i][columns[j]];
      } else {
        let editBtn = document.createElement("button");
        let deleteBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", function (event) {
          return editRow(event);
        });
        deleteBtn.innerHTML = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function (event) {
          return deleteRow(event);
        });

        td.appendChild(editBtn);
        td.appendChild(deleteBtn);
      }
    }
  }

  var tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = "";
  tableContainer.appendChild(tableData);
}

function editRow(event) {
  let tr = event.target.parentElement.parentElement;
  if (event.target.innerHTML === "Edit") {
    tr.contentEditable = true;
    event.target.parentElement.contentEditable = false;
    event.target.innerHTML = "Save";
    event.target.parentElement.getElementsByClassName(
      "delete-btn"
    )[0].innerHTML = "Cancel";
  } else {
    tr.contentEditable = false;
    let index = tr.rowIndex;
    for (let i = 0; i < tr.children.length - 1; i++) {
      jsonData[index - 1][columns[i]] = tr.children[i].innerHTML;
    }
    event.target.innerHTML = "Edit";
    event.target.parentElement.getElementsByClassName(
      "delete-btn"
    )[0].innerHTML = "Delete";
  }
}

function deleteRow(event) {
  let tr = event.target.parentElement.parentElement;
  if (event.target.innerHTML === "Delete") {
    let index = tr.rowIndex;
    tr.parentElement.removeChild(tr);
    jsonData.splice(index - 1, 1);
  } else {
    tr.contentEditable = false;
    let index = tr.rowIndex;
    for (let i = 0; i < tr.children.length - 1; i++) {
      tr.children[i].innerHTML = jsonData[index - 1][columns[i]];
    }
    event.target.innerHTML = "Delete";
    event.target.parentElement.getElementsByClassName("edit-btn")[0].innerHTML =
      "Edit";
  }
}

function refreshData() {
  let divContainer = document.getElementById("table-container");
  divContainer.removeChild(divContainer.firstChild);
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => (jsonData = data));
  loadData();
}
