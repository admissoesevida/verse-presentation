<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

/**
 * Set Bible version - Expects Version ID (number)
 */
if (isset($_POST["versionId"])) {
  $proposed = $_POST["versionId"];

  if (!is_numeric($proposed) or
    !in_array($proposed, array_keys($bible->getAvailableBibles()))) {
    response("Bad request", 403);
    exit;
  }

  if ($bible->setBible($proposed)) {
    response("Request Succeeded");
  } else {
    response("Request Failed", 500);
  }
  exit;
}

response([
  "message" => "Request not recognized",
  "body" => $_POST
], 500);