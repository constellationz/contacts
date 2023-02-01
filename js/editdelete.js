function editContact(event) {
    var row = event.target.parentNode.parentNode;
    var name = row.querySelector("td:nth-child(1)").textContent;
    var company = row.querySelector("td:nth-child(2)").textContent;
    var phone = row.querySelector("td:nth-child(3)").textContent;
    var email = row.querySelector("td:nth-child(4)").textContent;
    //add the input fields to the row to allow inline editing
    row.querySelector("td:nth-child(1)").innerHTML = '<input name="txtupdate_Name"  disabled id="txtupdate_Name" value="' + name + '"/>';
    row.querySelector("td:nth-child(2)").innerHTML = '<input name="txtupdate_Company"  disabled id="txtupdate_Company" value="' + company + '"/>';
    row.querySelector("td:nth-child(3)").innerHTML = '<input name="txtupdate_Phone"  disabled id="txtupdate_Phone" value="' + phone + '"/>';
    row.querySelector("td:nth-child(4)").innerHTML = '<input name="txtupdate_Email"  disabled id="txtupdate_Email" value="' + email + '"/>';
    //change the edit button to a save button
    event.target.innerHTML = "Save";
    event.target.removeEventListener("click", editContact);
    event.target.addEventListener("click", saveContact);
}

function saveContact(event) {
    var row = event.target.parentNode.parentNode;
    var name = row.querySelector("td:nth-child(1) input").value;
    var company = row.querySelector("td:nth-child(2) input").value;
    var phone = row.querySelector("td:nth-child(3) input").value;
    var email = row.querySelector("td:nth-child(4) input").value;
    //update the table with the new data
    row.querySelector("td:nth-child(1)").textContent = name;
    row.querySelector("td:nth-child(2)").textContent = company;
    row.querySelector("td:nth-child(3)").textContent = phone;
    row.querySelector("td:nth-child(4)").textContent = email;
    //change the save button back to an edit button
    event.target.innerHTML = "Edit";
    event.target.removeEventListener("click", saveContact);
    event.target.addEventListener("click", editContact);
}



function deleteContact(event) {
    if (confirm("Are you sure you want to delete this contact?")) {
        var row = event.target.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

function newContact(){
    var name = prompt("Enter the contact's name:");
    var company = prompt("Enter the contact's company:");
    var phone = prompt("Enter the contact's phone number:");
    var email = prompt("Enter the contact's email:");

    var table = document.querySelector(".contact-table");
    var newRow = table.insertRow(-1);
    var nameCell = newRow.insertCell(0);
    var companyCell = newRow.insertCell(1);
    var phoneCell = newRow.insertCell(2);
    var emailCell = newRow.insertCell(3);
    var editCell = newRow.insertCell(4);
    var deleteCell = newRow.insertCell(5);

    nameCell.innerHTML = name;
    companyCell.innerHTML = company;
    phoneCell.innerHTML = phone;
    emailCell.innerHTML = email;
    editCell.innerHTML = "<button class='edit-button' type='button' onclick='editContact(event)'>Edit</button>";
    deleteCell.innerHTML = "<button class='delete-button' type='button' onclick='deleteContact(event)'>Delete</button>";
      }
