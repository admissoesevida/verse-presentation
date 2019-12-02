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

/**
 * @param  mixed       $content
 * @param  int|integer $code
 * @return void
 */
function response($content, int $code = 200) {
  print_json($content, $code);
}

/**
 * @param  Exception $exception
 * @return void
 */
function response_error(Exception $exception) {
  print_json($exception->getMessage(), $exception->getCode());
}

/**
 * @param  mixed $content
 * @param  int    $code
 * @return void
 */
function print_json($content, int $code) {
  header('Content-Type: application/json');
  echo json_encode([
    "code" => $code,
    "content" => $content
  ]);
}