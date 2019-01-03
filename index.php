<pre>
<?php

require "php/Classes/Bible.php";

$bible = new BibleAPI;

$results = $bible->searchVerses("Prov 1 2")[0];
$bible->setVerse($results["bookId"], $results['chapter'], $results['verse']);

$verseObject = [
  "bookId" => 1,
  "chapter" => 'a',
  "verse" => 1
];

$hasCorrectKeys = array_keys($verseObject) !== ["bookId", "chapter", "verse"];

$hasCorrectTypes = count(array_filter(array_map(function ($item) {
  return !is_numeric($item);
}, $verseObject))) === 0;

vlog($verseObject);

var_dump($hasCorrectTypes);

/* 
vlog($results);

vlog($bible->setBible(1));
$bible->reloadVerse();
vlog($bible->getVerseData());

vlog($bible->setBible(2));
$bible->reloadVerse();
vlog($bible->getVerseData());

vlog($bible->setBible(3));
$bible->reloadVerse();
vlog($bible->getVerseData());

 */