<?php

include 'connect.php';

$ProjectType = $_POST['ProjectType'];

if ($ProjectType == 'Current')
{
    $Projects =  mysql_query("SELECT * FROM Projects WHERE EndDate > CURRENT_TIMESTAMP AND StartDate < CURRENT_TIMESTAMP ORDER BY ID ASC", $con);
}
elseif ($ProjectType == 'Past')
{
    $Projects =  mysql_query("SELECT * FROM Projects WHERE EndDate < CURRENT_TIMESTAMP ORDER BY ID ASC ", $con);
}
elseif ($ProjectType == 'Future')
{
    $Projects =  mysql_query("SELECT * FROM Projects WHERE StartDate > CURRENT_TIMESTAMP ORDER BY ID ASC ", $con);
}
$PMembers =  mysql_query("SELECT S.ID, S.FirstName, S.LastName, S.URL, S.Dev, S.Design, S.Research, S.UX, A.P_ID FROM Staff S JOIN Assignments A ON A.Staff_ID = S.ID ORDER BY A.P_ID ASC",$con);

$ProjectsJSON = null;
$PMembersJSON = null;
$i = 0;

while($row = mysql_fetch_assoc($Projects)){
    $ProjectsJSON[$i] = $row;
    $i++;
}

$i = 0;
while($row = mysql_fetch_assoc($PMembers)){
    $PMembersJSON[$i] = $row;
    $i++;
}

$Data = Array ($ProjectsJSON,$PMembersJSON);
echo json_encode($Data);



?>