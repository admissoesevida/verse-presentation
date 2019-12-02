let CURRENT_VERSE = '';

const updateVerse = async () => {
  const verse = await fetchVerse();

  if (verse && !CURRENT_VERSE.equalsTo(verse)) {
    CURRENT_VERSE = verse;
    await updateDom();
    changeBackgroundImage();
  }
}

updateVerse();

socket.on('updateVerse', async () => {
  updateVerse();
});