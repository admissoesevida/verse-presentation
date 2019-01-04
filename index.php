<pre>
<?php

require "php/Classes/Bible.php";

$bible = new BibleAPI;

$chapter = isset($_GET["c"]) ? $_GET["c"] : 1;
$verse = isset($_GET["v"]) ? $_GET["v"] : 1;

$results = $bible->searchVerses("Sal $chapter $verse")[0];
var_dump($bible->setVerse($results["bookId"], $results['chapter'], $results['verse']));

vlog($bible->getVerseData());

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