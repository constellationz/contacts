const urlBase = 'LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "* Username or password incorrect";
					document.getElementById("loginResult").style.color = "red";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;
//	var hash = md5( password );

	let registerResult = document.getElementById("registerResult");
	registerResult.style.color = "red";
	if (firstName.length == 0)
	{
		registerResult.innerHTML = "First Name Cannot Be Blank";
		return;
	}
	else if (lastName.length == 0)
	{
		registerResult.innerHTML = "Last Name Cannot Be Blank";
		return;
	}
	else if (login.length == 0)
	{
		registerResult.innerHTML = "Username Cannot Be Blank";
		return;
	}
	else if (password.length == 0)
	{
		registerResult.innerHTML = "Password Cannot Be Blank";
		return;
	}

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/RegisterUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				let error = jsonObject.error;

				if (error === "Error: User Already Exists")
				{
					registerResult.innerHTML = "Username Already Exists";
				}
				else
				{
					window.location.href = "index.html";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		windows.alert("Something went wrong...");
	}

}

function loadContacts() 
{
	let tmp = {userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/GetAllContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				fillTable(JSON.parse(xhr.response));
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		windows.alert("Something went wrong...");
	}
}

function addContact()
{
	let name = document.getElementById("enter-name").value;
	let phone = document.getElementById("enter-phone").value;
	let email = document.getElementById("enter-email").value;

	let tmp = {name:name,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// Commented out on purpose, copied from Leinecker's code
				// window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		windows.alert("Something went wrong...");
	}

}

function searchContacts()
{
	document.getElementById("resetSearch").hidden = false;
	let search = document.getElementById("searchbar").value;

	let tmp = {search:search,userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				fillTable(JSON.parse(xhr.response));
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		windows.alert("Something went wrong...");
	}

	document.getElementById("searchbar").value = "";
}

function resetSearch()
{
	document.getElementById("resetSearch").hidden = true;
	document.getElementById("searchbar").value = "";
	loadContacts();
}

function fillTable(json)
{
	let contacts = json.results;
	let table = document.getElementById("table");
	table.innerHTML = "";

	if (json.error === "User Has No Records")
	{
		let caption = document.getElementById("table").createCaption();
		caption.innerHTML = "You have no records!";
		return;
	}
	else if (json.error === "No Records Found")
	{
		let caption = document.getElementById("table").createCaption();
		caption.innerHTML = "There are no records with that search!";
		return;
	}

	let header = table.createTHead();
	let rowTemp = header.insertRow(0);
	let headerCell1 = rowTemp.insertCell(0);
	let headerCell2 = rowTemp.insertCell(1);
	let headerCell3 = rowTemp.insertCell(2);
	headerCell1.innerHTML = "Name";
	headerCell2.innerHTML = "Phone";
	headerCell3.innerHTML = "Email";
	rowTemp.classList.add("top-row");

	for (let contact of contacts)
	{
		let numRows = table.rows.length;
		let row = table.insertRow(numRows);
		let cell1 = row.insertCell(0);
		let cell2 = row.insertCell(1);
		let cell3 = row.insertCell(2);
		let cell4 = row.insertCell(3);
		let cell5 = row.insertCell(4);
		cell1.innerHTML = contact.name;
		cell2.innerHTML = contact.phone;
		cell3.innerHTML = contact.email;
		cell4.innerHTML = `<button class="edit-button" type="button" onclick="editContact(event, ${contact.id})">Edit</button>`;
		cell5.innerHTML = `<button class="delete-button" type="button" onclick="deleteContact(event, ${contact.id});">Delete</button>`;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
