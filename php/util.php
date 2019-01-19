<?php

header("Cache-Control: no-cache, must-revalidate"); //HTTP 1.1
header("Pragma: no-cache"); //HTTP 1.0
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

/**
 *
 * @param mixed $item
 * @return void
 */
function vlog($item)
{
  print_r($item);
  echo "<br>";
}

function response($content, $code = 200) {
  header('Content-Type: application/json');
  echo json_encode([
    "code" => $code,
    "content" => $content
  ]);
}