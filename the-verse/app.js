let CURRENT_VERSE = '';

setInterval(async () => {
  const nextVerse = await fetchVerse();

  if (nextVerse && !CURRENT_VERSE.equalsTo(nextVerse)) {
    CURRENT_VERSE = nextVerse;
    console.log(CURRENT_VERSE);
    await updateDom();
    changeBackgroundImage();
  }
}, 200);
