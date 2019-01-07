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
  const loader = new LoaderController('#loader');

  const { book, chapter, verse: verseNumber, text: verseText } = CURRENT_VERSE;

  loader.enable();
  main.classList.add('off');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      verse.innerHTML = verseText;
      reference.innerHTML =
        book + ' ' + chapter.toNumber(1) + ':' + verseNumber.toNumber();

      main.classList.remove('off');

      loader.disable();
      resolve();
    }, delay);
  });
};

const toggleFullscreen = (element, classWhenFulScreen) => {
  const isFullScreen =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
      document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);

  const { documentElement: elem } = document;
  if (!isFullScreen) {
    element.classList.add(classWhenFulScreen);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    element.classList.remove(classWhenFulScreen);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

document.querySelector('#openFullScreen').addEventListener('click', event => {
  toggleFullscreen(event.target, 'isFullScreen');
});
