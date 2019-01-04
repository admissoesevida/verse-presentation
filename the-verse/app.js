let CURRENT_VERSE = '';
const updateCurrentVerse = async () => {
  let nextVerse = await fetchVerse();

  if (nextVerse && !CURRENT_VERSE.equalsTo(nextVerse)) {
    CURRENT_VERSE = nextVerse;
    await updateDom();
  }
};

const main = async () => {
  await updateCurrentVerse();
};

setInterval(() => {
  main();
}, 200);
