<?php

require "php/Classes/Bible.php";

$bible = new BibleAPI;

if (isset($_GET["verse"])) {
  echo json_encode(
    $bible->getVerseData()
  );
  exit;
}
