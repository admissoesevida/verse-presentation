<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

/**
 * Search for the most relevant results, based on the Book Name
 */
if (isset($_POST["mostRelevant"])) {
  $search_terms = $_POST["mostRelevant"];
  try {
    $results = $bible->searchVerses($search_terms);
  } catch (Exception $e) {
    response_error($e);
    exit;
  }

  response([
    "terms" => $search_terms,
    "results" => $results
  ]);
  exit;
}

/**
 * Search for the least relevant results, based on the Book Abbreviation
 */
if (isset($_POST["lessRelevant"])) {
  $search_terms = $_POST["lessRelevant"];
  try {
    $results = $bible->searchLessRelevantVerses($search_terms);
  } catch (Exception $e) {
    response_error($e);
    exit;
  }

  response([
    "terms" => $search_terms,
    "results" => $results
  ]);

  exit;
}