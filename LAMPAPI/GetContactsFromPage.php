<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$amountOnPage = $inData["amount"];
	$pageOffset = $inData["page"]*$amountOnPage;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select ID, Name, Phone, Email from Contacts where UserID=? limit ? offset ?");
		$stmt->bind_param("iii", $inData["userId"], $amountOnPage, $pageOffset);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"id":'.$row["ID"].',"name":"'.$row["Name"].'","phone":"'.$row["Phone"].'","email":"'.$row["Email"].'"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "User Has No Records" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
