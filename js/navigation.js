document.addEventListener('keydown', async ({ key }) => {
  if (key === 'ArrowLeft') {
    await navigate('prev');
  }

  if (key === 'ArrowRight') {
    await navigate('next');
  }
});

async function navigate(direction) {
  const loader = new LoaderController('#loader');
  loader.enable();

  try {
    const url = `../php/api/navigation.php?${direction}`;
    const rawVerse = await fetch(url);
    const verse = await rawVerse.json();

    if (verse.code !== 200) {
      console.log(verse);
    }
  } catch (reason) {
    console.error('Error on navigating to the Verse\n', reason);
  }
}
