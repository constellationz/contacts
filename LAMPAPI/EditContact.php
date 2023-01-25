<?php
	$inData = getRequestInfo();

	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$id = $inData["id"];

	$nameLength = strlen($name);
	$phoneLength = strlen($phone);
	$emailLength = strlen($email);

	$error = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}

	if ($nameLength > 50 || $phoneLength > 50 || $emailLength > 50)
	{
		$error .= "Error: ";
		$error .= ($nameLength > 50) ? "Name" : (($phoneLength > 50) ? "Phone" : "Email");
		$error .= " String Too Long";
	}
	else
	{
		if ($nameLength !== 0)
		{
			$stmt1 = $conn->prepare("UPDATE Contacts SET Name=? WHERE ID=?");
			$stmt1->bind_param("si", $name, $id);
			$stmt1->execute();
			$stmt1->close();
		}
		if ($phoneLength !== 0)
		{
			$stmt2 = $conn->prepare("UPDATE Contacts SET Phone=? WHERE ID=?");
			$stmt2->bind_param("si", $phone, $id);
			$stmt2->execute();
			$stmt2->close();
		}
		if ($emailLength !== 0)
		{
			$stmt3 = $conn->prepare("UPDATE Contacts SET Email=? WHERE ID=?");
			$stmt3->bind_param("si", $email, $id);
			$stmt3->execute();
			$stmt3->close();
		}	
	}

	$stmt4 = $conn->prepare("select Name, Phone, Email from Contacts where ID=?");
	$stmt4->bind_param("i", $id);
	$stmt4->execute();

	$result = $stmt4->get_result();
	$row = $result->fetch_assoc();

	$newEntry = '{"name":"'.$row["Name"].'","phone":"'.$row["Phone"].'","email":"'.$row["Email"].'", "error": "'.$error.'"}';

	$stmt4->close();
	$conn->close();
	sendResultInfoAsJson($newEntry);

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
?>
