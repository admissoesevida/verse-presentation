<?php

require "../Classes/Bible.php";

$bible = new BibleAPI;

$availableVersions = $bible->getAvailableBibles();
$current = $bible->getCurrentVersion();

response([
  "availableVersions" => $availableVersions,
  "currentVersion" => $current
]);