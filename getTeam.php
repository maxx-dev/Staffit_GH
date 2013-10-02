<?php

include 'connect.php';



$Projects =  mysql_query("SELECT S.ID, S.FirstName, S.LastName, S.URL, S.Dev, S.Research, S.Design, S.UX,  A.P_ID, P.Name, DATE_FORMAT(P.StartDate,'%Y/%c/%d') AS StartDate , DATE_FORMAT(P.EndDate,'%Y/%c/%d') AS EndDate FROM Staff S JOIN Assignments A  ON S.ID = A.Staff_ID JOIN Projects P ON P.ID = A.P_ID WHERE S.ID < 999 ORDER BY S.ID", $con);
$Vacations = mysql_query("SELECT ID, Staff_ID, DATE_FORMAT(StartDate,'%Y/%c/%d') AS StartDate, DATE_FORMAT(EndDate,'%Y/%c/%d') AS EndDate FROM Vacations WHERE Staff_ID < 999 ORDER BY ID", $con);


$ProjectsJSON = null;
$VacationsJSON = null;
$Check = true;
$i = 0;

while($row = mysql_fetch_assoc($Projects)){
    $ProjectsJSON[$i] = $row;
    $i++;
}

while($row = mysql_fetch_assoc($Vacations)){
    $VacationsJSON[$i] = $row;
    $i++;
}

//echo var_dump($DataJSON);
$Data =  Array($ProjectsJSON,$VacationsJSON);
echo json_encode($Data);



?>