<?php


$Project = $_POST['Project'];
$TimeRange = $_POST['TimeRange'];
$Team = $_POST['Team'];
$Notes = $_POST['Notes'];

echo $Project;
echo '</br>';
echo $TimeRange;
echo '</br>';
echo $Team;
echo '</br>';
echo $Notes;

$SenderName = 'Franz';
$SenderMail = 'derkaiser.franz@sap.com';
$Reason = 'You are assigned to a new Project: '.$Project;

$Message = '<div style="position:absolute; top:50px"><h2>Nachricht</h2>'.$Team.'</div>';
$Message .= '<div style="position:absolute; top:00px"><h2>TimeRange</h2>'.$TimeRange.'</div>';
$Message .= '<div style="position:absolute; top:200px"><h2>Notes</h2>'.$Notes.'</div>';

$Header = "From: '$SenderName' <$SenderMail>\n";
$Header .= "Content-Type: text/html\n";

//$Send = mail('daniel.wurst@sap.com',$Reason,$Message,$Header);
$Send = mail('info@unigrade.de',$Reason,$Message,$Header);



?>