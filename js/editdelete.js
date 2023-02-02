const fullscreenDiv = document.getElementById('fullscreen-div');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const form = document.getElementById('modal');
const saveBtn = document.getElementById('save-btn');

function editContact(event) {
    var row = event.target.parentNode.parentNode;
    var name = row.querySelector("td:nth-child(1)").textContent;
    var company = row.querySelector("td:nth-child(2)").textContent;
    var phone = row.querySelector("td:nth-child(3)").textContent;
    var email = row.querySelector("td:nth-child(4)").textContent;
    //add the input fields to the row to allow inline editing
    row.querySelector("td:nth-child(1)").innerHTML = "<input type='text' value='"+name+"'>";
    row.querySelector("td:nth-child(2)").innerHTML = "<input type='text' value='"+company+"'>";
    row.querySelector("td:nth-child(3)").innerHTML = "<input type='text' value='"+phone+"'>";
    row.querySelector("td:nth-child(4)").innerHTML = "<input type='text' value='"+email+"'>";
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
    row.querySelector("td:nth-child(1)").innerHTML = name;
    row.querySelector("td:nth-child(2)").innerHTML = company;
    row.querySelector("td:nth-child(3)").innerHTML = phone;
    row.querySelector("td:nth-child(4)").innerHTML = email;
    //change the save button back to an edit button
    event.target.innerHTML = "Edit";
    event.target.removeEventListener("click", saveContact);
    event.target.addEventListener("click", editContact);
}



function deleteContact(event, id) {
    if (confirm("Are you sure you want to delete this contact?")) {
        var row = event.target.parentNode.parentNode;
        deleteFromDatabase(id);
        row.parentNode.removeChild(row);
    }
}

function deleteFromDatabase(id)
{
    let tmp = {id:id};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// alert("The contact has been deleted");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		windows.alert("Something went wrong...");
	}
}

function newContact(){
    var name = document.getElementById("enter-name").value;
    var company = document.getElementById("enter-company").value;
    var phone = document.getElementById("enter-phone").value;
    var email = document.getElementById("enter-email").value;

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

// UI class
class UI{
    static showModal(){
        modal.style.display = "block";
        fullscreenDiv.style.display = "block";
    }

    static closeModal(){
        modal.style.display = "none";
        fullscreenDiv.style.display = "none";
    }
}

// DOM Content Loaded
window.addEventListener('DOMContentLoaded', () => {
    eventListeners();
});

// event listeners
function eventListeners(){
    // show add item modal
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('modal-title').innerHTML = "Add Content";
        UI.showModal();
    });

    // close add item modal
    closeBtn.addEventListener('click', UI.closeModal);

	saveBtn.addEventListener('click', () => {
        location.reload();
        UI.closeModal();
    });
}
