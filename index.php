<pre>
<?php

require "php/Classes/Bible.php";

$bible = new BibleAPI;

$chapter = isset($_GET["c"]) ? $_GET["c"] : 1;
$verse = isset($_GET["v"]) ? $_GET["v"] : 1;

$search = "sal $chapter $verse a";

$results = $bible->searchVerses($search);

vlog('Most Relevant');
vlog($results);

$results = $bible->searchLessRelevantVerses($search);

vlog('Less Relevant');
vlog($results);

