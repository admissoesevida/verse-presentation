<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

$response = [
  "code" => 500,
  "message" => "Bad request"
];

$status = null;
if (isset($_GET["next"])) {
  $status = $bible->nextVerse();
} else if (isset($_GET["prev"])) {
  $status = $bible->previousVerse();
}

if (!is_null($status)) {
  $response = [
    "code" => $status ? 200 : 500,
    "message" => $status ? "Operation Succeeded" : "Operation Failed"
  ];
}

echo json_encode($response);
