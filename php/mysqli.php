<?php

include "credentials.php";
include "create_mysqli_connection.php";

$connection["biblia-app"] = create_mysqli_connection($credentials["biblia-app"]);
$connection["biblia-acf"] = create_mysqli_connection($credentials["biblia-acf"]);
$connection["biblia-aa"] = create_mysqli_connection($credentials["biblia-aa"]);
$connection["biblia-nvi"] = create_mysqli_connection($credentials["biblia-nvi"]);