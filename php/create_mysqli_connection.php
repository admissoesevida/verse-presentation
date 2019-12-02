<?php

/**
 * @param $credentials
 * @return mysqli
 */
function create_mysqli_connection($credentials) {
  $mysqli = new mysqli(
    $credentials["host"],
    $credentials["user"],
    $credentials["pass"],
    $credentials["db"]
  );

  if ($mysqli->connect_error) {
    die("Connect Error ($mysqli->connect_errno) $mysqli->connect_error");
  }

  if (!$mysqli->set_charset("utf8")) {
    die("Error loading character set utf8: $mysqli->error");
  }

  return $mysqli;
}