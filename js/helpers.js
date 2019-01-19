const fetchVerse = async () => {
  try {
    const url = `../php/api/the_verse.php`;
    const rawVerse = await fetch(url);

    return await rawVerse.json();;
  } catch (reason) {
    console.error('Error on fetching the Verse\n', reason);
  }
  return false;
};

const changeVersion = async (newVersion) => {
  const request = new FormData();

  request.set('versionId', newVersion);
  try {
    const rawResponse = await fetch('../php/api/set_version.php', {
      method: 'POST',
      body: request
    });

    return await rawResponse.json();
  } catch (reason) {
    console.error('Error on changing the Version\n', reason);
  }
  return false;
};

const getAvailableVersions = async () => {
  try {
    const url = `../php/api/get_available_versions.php`;
    const rawVersions = await fetch(url);
    const versions = await rawVersions.json();

    return versions.content;
  } catch (reason) {
    console.error('Error on fetching the Verse\n', reason);
  }
  return false;
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