<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

echo json_encode(
  $bible->getVerseData()
);
