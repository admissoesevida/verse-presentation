let CURRENT_VERSE = '';

let CHECK_IN_PROGRESS = false;

setInterval(async () => {
  if (CHECK_IN_PROGRESS) return;

  CHECK_IN_PROGRESS = true;
  const nextVerse = await fetchVerse();

  if (nextVerse && !CURRENT_VERSE.equalsTo(nextVerse)) {
    CURRENT_VERSE = nextVerse;
    await updateDom();
    changeBackgroundImage();
  }

  CHECK_IN_PROGRESS = false;
}, 200);
