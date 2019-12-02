const fetchVerse = async () => {
  return await get('../php/api/the_verse.php', 'Error getting current verse', false);
};

const fetchRelevantResults = async mostRelevant => {
  return await post(
    '../php/api/search.php',
    { mostRelevant },
    'Error on fetching the results\n'
  );
};

const fetchLessRelevantResults = async lessRelevant => {
  return await post(
    '../php/api/search.php',
    { lessRelevant },
    'Error on fetching the results\n'
  );
};

const changeVersion = async (versionId) => {
  let updateVerse = await post(
    '../php/api/set_version.php',
    { versionId },
    'Error changing the Version\n'
  );

  if (updateVerse) {
    socket.emit("updateVerse", 1);
  }

  return updateVerse;
};

const setVerse = async (bookId, chapter, verse) => {
  if (!bookId || !chapter || !verse) {
    return false;
  }

  const updateVerse = await post(
    '../php/api/set_verse.php',
    { bookId, chapter, verse },
    'Error on setting the Verse\n'
  );

  if (updateVerse) {
    socket.emit("updateVerse", 1);
  }

  return updateVerse;
};

const getAvailableVersions = async () => {
  const { content } = await get('../php/api/get_available_versions.php');

  return content;
};

const updateDom = async () => {
  if (!CURRENT_VERSE) return;

  const container = document.querySelector('main');
  const verse = document.querySelector('#verse');
  const reference = document.querySelector('#reference');

  await changeText(reference, verse, container);
};

const updateControlVerse = async () => {
  if (!CURRENT_VERSE) return;

  const container = document.querySelector('#current');
  const verse = document.querySelector('#current .verse');
  const reference = document.querySelector('#current .ref');

  verse.innerHTML = '';
  reference.innerHTML = '';

  await changeText(reference, verse, container, 600);
};

const changeText = async (referenceElement, verseElement, container, delay = 200, loaderSelector = '#loader') => {
  const loader = new LoaderController(loaderSelector);

  if (!referenceElement || !verseElement || !container) {
    return;
  }

  const { book, chapter, verse: verseNumber, text: verseText, version } = CURRENT_VERSE;

  loader.enable();
  container.classList.add('off');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      verseElement.innerHTML = verseText;
      referenceElement.innerHTML =
        book + ' ' + chapter.toNumber(1) + ':' + verseNumber.toNumber() + ' - ' + version.toUpperCase();

      container.classList.remove('off');

      loader.disable();
      resolve();
    }, delay);
  });
};

const changeBackgroundImage = () => {
  const MAX_IMAGE_INDEX = 5;
  const background = document.querySelector('#background');

  let current_image_index = parseInt(background.dataset.currentindex);

  if (current_image_index + 1 > MAX_IMAGE_INDEX) {
    current_image_index = 0;
  }

  background.classList.add('black');

  setTimeout(() => {
    background.style.backgroundImage =
      'url(img/' + ++current_image_index + '.jpg)';

    background.classList.remove('black');

    background.dataset.currentindex = current_image_index;
  }, 700);
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

const openFullScreen = document.querySelector('#openFullScreen');

if (openFullScreen) {
    openFullScreen.addEventListener('click', event => {
      toggleFullscreen(event.target, 'isFullScreen');
    });
}

const handleInput = terms => {
  const pieces = terms.split(' ').filter(i => i !== '');

  if (pieces.length < 3) {
    return false;
  }

  const verse = pieces.pop();
  const chapter = pieces.pop();

  if (isNaN(verse) || isNaN(chapter)){
    return false;
  }

  const book = pieces.join(' ');

  return { book, chapter, verse };
}