<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

/**
 * Set the verse, expects 3 numbers
 */
if (
    isset($_POST["bookId"]) &&
    isset($_POST["chapter"]) &&
    isset($_POST["verse"])
  ) {

  $verseObject = [
    "bookId" => $_POST["bookId"],
    "chapter" => $_POST["chapter"],
    "verse" => $_POST["verse"]
  ];

  $hasCorrectTypes = count(array_filter(array_map(function ($item) {
    return !is_numeric($item);
  }, $verseObject))) === 0;

  if (!$hasCorrectTypes) {
    response_error(new Exception("Some of the values you sent have incorrect types", 403));
    exit;
  }

  $succeeded = $bible->setVerse(
    $verseObject["bookId"],
    $verseObject["chapter"],
    $verseObject["verse"]
  );

  if ($succeeded) {
    response("Verse set successfully");
  } else {
    response_error(new Exception("Failed setting the verse", 500));
  }
  exit;
}