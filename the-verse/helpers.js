const fetchVerse = async () => {
  try {
    const url = `../php/api/the_verse.php`;
    const rawVerse = await fetch(url);
    const verse = await rawVerse.json();

    return verse;
  } catch (reason) {
    console.error('Error on fetching the Verse\n', reason);
  }
  return false;
};

const updateDom = async () => {
  if (!CURRENT_VERSE) return;

  await changeText();
};

const changeText = async (delay = 200) => {
  const main = document.querySelector('main');
  const verse = document.querySelector('#verse');
  const reference = document.querySelector('#reference');

  const { book, chapter, verse: verseNumber, text: verseText } = CURRENT_VERSE;

  main.classList.add('off');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      verse.innerHTML = verseText;
      reference.innerHTML =
        book + ' ' + chapter.toNumber(1) + ':' + verseNumber.toNumber();

      main.classList.remove('off');
      resolve();
    }, delay);
  });
};
