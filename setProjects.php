<?php

include 'connect.php';

$Type = $_POST['Type'];
$Val = $_POST['Val'];
$P_ID = $_POST['P_ID'];

echo $Type;
echo $Val;
echo $P_ID;

mysql_query("UPDATE Projects set $Type = '$Val' WHERE ID = $P_ID ", $con);

?>