<pre>
<?php

require "php/api/Bible.php";

$bible = new BibleAPI;

$results = $bible->searchVerses("Prov 1 2")[0];
$bible->setVerse($results["bookId"], $results['chapter'], $results['verse']);

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