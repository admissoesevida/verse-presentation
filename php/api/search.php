<?php

require "php/Classes/Bible.php";

$bible = new BibleAPI;

/**
 * Search for the most relevant results, based on the Book Name
 */
if (isset($_POST["mostRelevant"])) {
  echo json_encode(
    $bible->searchVerses($_POST["mostRelevant"])
  );
  exit;
}

/**
 * Search for the least relevant results, based on the Book Abbreviation
 */
if (isset($_POST["lessRelevant"])) {
  echo json_encode(
    $bible->searchLessRelevantVerses($_POST["lessRelevant"])
  );
  exit;
}

/**
 * Set the verse, expects an array of 3 numbers 
 */
if (isset($_PUT["verse"])) {
  try {
    $verseObject = json_decode($_PUT["verse"]);
  } catch (Exception $e) {
    echo json_encode($e);
    exit;
  }

  $hasCorrectKeys = array_keys($verseObject) !== ["bookId", "chapter", "verse"];
  $hasCorrectTypes = count(array_filter(array_map(function ($item) {
    return !is_numeric($item);
  }, $verseObject))) === 0;

  if (!$hasCorrectKeys or !$hasCorrectTypes) {
    echo json_encode([
      "error" => "Bad request",
      "code" => 403
    ]);
    exit;
  }

  $succeeded = $bible->setVerse(
    $verseObject["bookId"],
    $verseObject["chapter"],
    $verseObject["verse"]
  );

  echo json_encode([
    "message" => $succeeded ? "Request Succeeded" : "Request Failed",
  ]);
  exit;
}

if (isset($_PUT["bible"])) {
  $proposed = $_PUT["bible"];
  if (!is_numeric($proposed) or
    !in_array($proposed, array_keys($bible->getAvailableBibles()))) {
    echo json_encode([
      "error" => "Bad request",
      "code" => 403
    ]);
    exit;
  }

  $succeeded = $bible->setBible($proposed);

  echo json_encode([
    "message" => $succeeded ? "Request Succeeded" : "Request Failed",
  ]);
  exit;
}