<?php
	$inData = getRequestInfo();

	$dateCreated = $inData["DateCreated"];
	$dateLastLoggedIn = $inData["DateLastLoggedIn"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$login = $inData["Login"];
	$password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?, ?, ?)");
		$stmt->bind_param("ss", $dateCreated, $dateLastLoggedIn, $firstName, $lastName, $login, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
