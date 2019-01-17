let CURRENT_VERSE = '';
let CURRENT_IMAGE_INDEX = 1;
const MAX_IMAGE_INDEX = 5;

const updateCurrentVerse = async () => {
  let nextVerse = await fetchVerse();

  if (nextVerse && !CURRENT_VERSE.equalsTo(nextVerse)) {
    CURRENT_VERSE = nextVerse;
    await updateDom();
    changeBackgroundImage();
  }
};

const changeBackgroundImage = () => {
  const background = document.querySelector('#background');

  if (CURRENT_IMAGE_INDEX + 1 > MAX_IMAGE_INDEX) {
    CURRENT_IMAGE_INDEX = 1;
  }

  background.style.backgroundImage =
    'url(img/' + ++CURRENT_IMAGE_INDEX + '.jpg)';
};

const main = async () => {
  await updateCurrentVerse();
};

setInterval(() => {
  main();
}, 200);
