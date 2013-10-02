<?php


$con = mysql_connect('localhost', 'root', 'root');
if (!$con)
{
    die('Could not connect: ' . mysql_error());
}

mysql_query("SET NAMES utf8");
mysql_select_db("StaffIT", $con);




?>