const body = document.querySelector('body');
var writing = false;

if (body.hasClass('arrow-navigation')) {
  document.addEventListener('keydown', async ({ key }) => {
    if(writing) return;

    if (key === 'ArrowLeft') {
      await navigate('prev');
    }

    if (key === 'ArrowRight') {
      await navigate('next');
    }
  });
}

const nextArea = document.querySelector("#mobile-controls #next");
const prevArea = document.querySelector("#mobile-controls #prev");

if (nextArea) {
  nextArea.addEventListener('click', async () => {
    await navigate('next');
  });
}

if (prevArea) {
  prevArea.addEventListener('click', async () => {
    await navigate('prev');
  });
}

const nextPanel = document.querySelector("#app-panel .navigation .next");
const prevPanel = document.querySelector("#app-panel .navigation .prev");

if (nextPanel) {
  nextPanel.addEventListener('click', async () => {
    await navigate('next');
  });
}

if (prevPanel) {
  prevPanel.addEventListener('click', async () => {
    await navigate('prev');
  });
}

async function navigate(direction) {
  const loader = new LoaderController('#loader');
  loader.enable();

  try {
    const url = `../php/api/navigation.php?${direction}`;
    const rawVerse = await fetch(url);
    const verse = await rawVerse.json();
    socket.emit('updateVerse', 1);
    
    if (verse.code !== 200) {
      console.log(verse);
    }
  } catch (reason) {
    console.error('Error on navigating to the Verse\n', reason);
  }
}
