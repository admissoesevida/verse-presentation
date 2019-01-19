<?php

include __DIR__ . "/../util.php";

class BibleAPI
{

  /**
   * @var mysqli
   */
  private $appDB;

  /**
   * @var mysqli
   */
  private $versionAa;

  /**
   * @var mysqli
   */
  private $versionNvi;

  /**
   * @var mysqli
   */
  private $versionAcf;

  /**
   * @var mysqli
   */
  private $bible;

  /**
   * @var int
   */
  private $currentVersion;

  /**
   * @var array
   */
  private $bibleIndex = [
    1 => "Aa",
    2 => "Acf",
    3 => "Nvi"
  ];

  /**
   * @var int
   */
  private $book = 0;

  /**
   * @var int
   */
  private $chapter = 1;

  /**
   * @var int
   */
  private $verse = 1;

  public function __construct()
  {
    include __DIR__ . "/../mysqli.php";

    $this->appDB = $connection["biblia-app"];

    $this->versionAa = $connection["biblia-aa"];
    $this->versionAcf = $connection["biblia-acf"];
    $this->versionNvi = $connection["biblia-nvi"];

    $currentVersion = $this->appDB->query("SELECT `id` FROM `current_version`");

    if ($currentVersion->num_rows !== 0) {
      $row = $currentVersion->fetch_assoc();
      $this->currentVersion = $row["id"];

      $bible = $this->bibleIndex[$this->currentVersion];
      $version = "version$bible";
      $this->bible = $this->$version;
    } else {
      $this->currentVersion = 2;
      $this->bible = $this->versionAcf;
    }

    $currentVerse = $this->appDB->query("
      SELECT `id`, `bookId`, `book`, `abbrev`, `chapter`, `verse`, `text`
      FROM `current_verse`
    ");

    if ($currentVerse->num_rows !== 0) {
      $verseData = $currentVerse->fetch_assoc();

      $this->book = $verseData["bookId"];
      $this->chapter = $verseData["chapter"];
      $this->verse = $verseData["verse"];
    }
  }

  /**
   * @return array
   */
  public function getAvailableBibles()
  {
    return $this->bibleIndex;
  }

  /**
   * @return void
   */
  public function reloadVerse()
  {
    $this->setVerse($this->book, $this->chapter, $this->verse);
  }

  /**
   * @param int $book
   * @param int $chapter
   * @param int $verse
   * @return bool
   */
  public function setVerse($book, $chapter, $verse)
  {
    if (!is_numeric($book) || !is_numeric($chapter) || !is_numeric($verse)) {
      return false;
    }

    $checkIfExists = $this->bible->query("
      SELECT * FROM `verses`
      WHERE `book`=$book AND `chapter`=$chapter AND `verse`=$verse")
      ->num_rows > 0;

    if (!$checkIfExists) {
      return;
    }

    $this->book = $book;
    $this->chapter = $chapter;
    $this->verse = $verse;

    return $this->updateAppDB();
  }

  /**
   * @return bool
   */
  private function updateAppDB()
  {
    $isCurrentVersionEmpty = $this->appDB->query("SELECT * FROM `current_version`")->num_rows === 0;

    $verseUpdated = false;
    if ($isCurrentVersionEmpty) {
      $verseUpdated = $this->executeInsertVersion();
    } else {
      $verseUpdated = $this->executeUpdateVersion();
    }

    $isCurrentVerseEmpty = $this->appDB->query("SELECT * FROM `current_verse`")->num_rows === 0;

    $versionUpdated = false;
    if ($isCurrentVerseEmpty) {
      $versionUpdated = $this->executeInsertVerse();
    } else {
      $versionUpdated = $this->executeUpdateVerse();
    }

    return $verseUpdated && $versionUpdated;
  }

  /**
   * @return bool
   */
  private function executeUpdateVerse()
  {
    $verseData = $this->getVerseData();

    $ssql = "
      UPDATE `current_verse` SET
        `bookId`= '$verseData[bookId]',
        `book`= '$verseData[book]',
        `abbrev`= '$verseData[abbrev]',
        `chapter`= $verseData[chapter],
        `verse`= $verseData[verse],
        `text`= '$verseData[text]',
        `version`= '$verseData[version]'";

    return $this->appDB->query($ssql);
  }

  /**
   * @return bool
   */
  private function executeInsertVerse()
  {
    $verseData = $this->getVerseData();

    $ssql = "
      INSERT INTO `current_verse` (`bookId`, `book`, `abbrev`, `chapter`, `verse`, `text`, `version`)
      VALUES
        ('$verseData[bookId]',
        '$verseData[book]',
        '$verseData[abbrev]',
        '$verseData[chapter]',
        '$verseData[verse]',
        '$verseData[text]',
        '$verseData[version]')";

    return $this->appDB->query($ssql);
  }

  /**
   * @return bool
   */
  private function executeUpdateVersion()
  {
    $ssql = "UPDATE `current_version` SET `id`= '$this->currentVersion'";

    return $this->appDB->query($ssql);
  }

  /**
   * @return bool
   */
  private function executeInsertVersion()
  {
    $ssql = "INSERT INTO `current_version` (`id`) VALUES ('$this->currentVersion')";

    echo $ssql;
    return $this->appDB->query($ssql);
  }

  /**
   * @return int
   */
  public function getVerse()
  {
    return $this->verse;
  }

  /**
   * @return int
   */
  public function getCurrentVerseId()
  {
    $currentId = $this->bible->query("
      SELECT `id` FROM `verses`
      WHERE `book`=$this->book AND `chapter`=$this->chapter AND `verse`=$this->verse");

    if (!$currentId) {
      return;
    }

    $row = $currentId->fetch_assoc();

    return $row["id"];
  }

  /**
   * @return bool
   */
  public function updateVerseById($verseId)
  {
    $verse = $this->bible->query("
        SELECT v.id, b.id as bookId, b.name as book, b.abbrev, v.chapter, v.verse, v.text, v.version
        FROM `verses` v LEFT JOIN `books` b ON v.`book` = b.`id`
        WHERE v.`id` = $verseId
      ");

    if (!$verse) {
      return false;
    }

    $verseData = $verse->fetch_assoc();

    $this->book = $verseData["bookId"];
    $this->chapter = $verseData["chapter"];
    $this->verse = $verseData["verse"];

    return $this->updateAppDB();
  }

  /**
   * @return bool
   */
  public function nextVerse()
  {
    $currentId = $this->getCurrentVerseId();

    return $this->updateVerseById($currentId + 1);
  }

  /**
   * @return bool
   */
  public function previousVerse()
  {
    $currentId = $this->getCurrentVerseId();

    return $this->updateVerseById($currentId - 1);
  }

  /**
   * @param int $bibleId
   * @return bool
   */
  public function setBible($bibleId)
  {
    if (in_array($bibleId, array_keys($this->bibleIndex))) {
      $bible = $this->bibleIndex[$bibleId];

      $version = "version$bible";
      $this->bible = $this->$version;
      $this->currentVersion = $bibleId;

      $this->reloadVerse();
      return true;
    }

    return false;
  }

  /**
   * @return int
   */
  public function getCurrentVersion()
  {
    return $this->currentVersion;
  }

  /**
   * @return string[]
   */
  public function getVerseData()
  {
    $ssql = "SELECT v.id, b.id as bookId, b.name as book, b.abbrev, v.chapter, v.verse, v.text, v.version
        FROM `verses` v LEFT JOIN `books` b ON v.`book` = b.`id`
        WHERE v.`book` = $this->book AND v.`chapter` = $this->chapter AND v.`verse` = $this->verse";

    $query = $this->bible->query($ssql)->fetch_assoc();

    return $query;
  }

  /**
   * @param string $searchString
   * @return array
   */
  private function preProcess($searchString)
  {
    $searchParts = explode(" ", $searchString);

    $verse = (int)array_pop($searchParts);
    $chapter = (int)array_pop($searchParts);

    if (!is_numeric($chapter)) {
      throw new Exception("Invalid Chapter", 403);
    }

    if (!is_numeric($verse)) {
      throw new Exception("Invalid Verse", 403);
    }

    $bookWords = array_values(array_filter($searchParts, function ($item) {
      return $item === "" ? false : true;
    }));

    if (count($bookWords) === 0) {
      throw new Exception("Invalid Book name", 403);
    }

    return [
      "bookWords" => $bookWords,
      "chapterId" => $chapter,
      "verseId" => $verse
    ];
  }

  /**
   * @param  string
   * @return array
   */
  public function searchVerses($searchString)
  {
    $queryData = $this->preProcess($searchString);

    $queryBookNames = [];
    foreach ($queryData["bookWords"] as $word) {
      $queryBookNames[] = "`name` LIKE '%$word%'";
      $queryBookNames[] = "`name_no_special_chars` LIKE '%$word%'";
    }

    $searchForBookNames = "
      SELECT *
      FROM `books`
      WHERE " . implode(" OR ", $queryBookNames) . ";";

    $bookNames = $this->bible->query($searchForBookNames);

    $results = [];

    if ($bookNames->num_rows > 0) {
      while ($book = $bookNames->fetch_assoc()) {
        $ssql = "SELECT v.id, b.id as bookId, b.name as book, v.chapter, v.verse, v.text
        FROM `verses` v LEFT JOIN `books` b ON v.`book` = b.`id`
        WHERE b.`id` = $book[id] AND v.`chapter` = $queryData[chapterId] AND v.`verse` = $queryData[verseId]";

        $result = $this->bible->query($ssql)->fetch_assoc();
        if ($result !== null) {
          $results[] = $result;
        }
      }
    }

    return $results;
  }

  /**
   * @param  string
   * @return array
   */
  public function searchLessRelevantVerses($searchString)
  {
    $queryData = $this->preProcess($searchString);

    $queryBookAbbrevs = [];
    foreach ($queryData["bookWords"] as $word) {
      $queryBookAbbrevs[] = "`abbrev` LIKE '%$word%'";
    }

    $searchForBookAbbrevs = "
      SELECT *
      FROM `books`
      WHERE " . implode(" OR ", $queryBookAbbrevs) . ";";

    $bookAbbrevs = $this->bible->query($searchForBookAbbrevs);

    $results = [];

    if ($bookAbbrevs->num_rows > 0) {
      while ($book = $bookAbbrevs->fetch_assoc()) {
        $ssql = "SELECT v.id, b.id as bookId, b.name as book, v.chapter, v.verse, v.text
        FROM `verses` v LEFT JOIN `books` b ON v.`book` = b.`id`
        WHERE b.`id` = $book[id] AND v.`chapter` = $queryData[chapterId] AND v.`verse` = $queryData[verseId]";

        $result = $this->bible->query($ssql)->fetch_assoc();
        if ($result !== null) {
          $results["lessRelevant"][] = $result;
        }
      }
    }

    return $results;
  }
}
