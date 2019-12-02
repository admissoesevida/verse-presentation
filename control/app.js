let CURRENT_VERSE = '';
let PREVIOUS_VALUE = '';

const updateVerse = async () => {
  const verse = await fetchVerse();

  if (verse && !CURRENT_VERSE.equalsTo(verse)) {
    CURRENT_VERSE = verse;
    await updateControlVerse();
  }
}

const setVersionListeners = async () => {
  const versionSwitchers = document.querySelectorAll('#version input');

  if (!versionSwitchers) {
    return;
  }

  for (const option of versionSwitchers) {
    option.addEventListener('change', async ({ target }) => {
      try {
        await changeVersion(target.dataset.id);
      } catch (e) {
        console.error(e);
      }

      const search = document.querySelector('#search-term');

      if (!search) return;

      await buildTables(search.value);
    });
  }
};

const rowSetVerse = async ({ currentTarget: row }) => {
  const { bookId, chapter, verse } = row.dataset;
  await setVerse(bookId, chapter, verse);
};

const setSearchListener = () => {
  const search = document.querySelector('#search-term');

  if (!search) {
    return;
  }

  search.addEventListener('keyup', async () => {
    const { value: terms } = search;

    if (terms === PREVIOUS_VALUE) return;

    PREVIOUS_VALUE = terms;

    await buildTables(terms);
  });
};

const buildTables = async terms => {
  const relevantCount = await buildRelevantTable(terms);
  const lessRelevantCount = await buildLessRelevantTable(terms);

  if (relevantCount + lessRelevantCount === 0) {
    const table = document.querySelector('#results');
    const row = table.insertRow();
    const emptyCell = row.insertCell();
    emptyCell.colSpan = '2';
    emptyCell.className = 'text-muted';
    emptyCell.innerHTML = 'Nenhum resultado para essa busca.';
  }
};

const buildRelevantTable = async terms => {
  if (!handleInput(terms)) {
    return;
  }

  const { content } = await fetchRelevantResults(terms);

  buildTable('#results', content.results);

  return content.results.length;
};

const buildLessRelevantTable = async terms => {
  if (!handleInput(terms)) {
    return;
  }

  const { content } = await fetchLessRelevantResults(terms);

  buildTable('#results', content.results, false);

  return content.results.length;
};

const buildTable = (selector, results, clean = true) => {
  const table = document.querySelector(selector);

  if (clean) table.innerHTML = '';

  for (const { book, bookId, chapter, verse, text } of results) {
    const row = table.insertRow();
    row.dataset.bookId = bookId;
    row.dataset.chapter = chapter;
    row.dataset.verse = verse;
    const refCol = row.insertCell(0);
    refCol.innerHTML = `${book} ${chapter}:${verse}`;

    const verseCol = row.insertCell(1);
    verseCol.innerHTML = text;

    row.addEventListener('click', rowSetVerse);
  }
};

const initialize = async () => {
  const { availableVersions, currentVersion } = await getAvailableVersions();

  const versions = document.querySelector('#version');
  versions.innerHTML = '';

  Object.keys(availableVersions).map(id => {
    const version = availableVersions[id];

    const input = document.createElement('input');
    input.dataset.id = id;
    input.id = version;
    input.type = 'radio';
    input.name = 'version';

    if (parseInt(currentVersion) === parseInt(id)) {
      input.checked = true;
    }

    const label = document.createElement('label');
    label.htmlFor = version;
    label.innerHTML = version.toUpperCase();

    versions.appendChild(input);
    versions.appendChild(label);
  });

  await setVersionListeners();
  setSearchListener();

  updateVerse();
  socket.on('updateVerse', async () => {
    await updateVerse();
  });
};

initialize();