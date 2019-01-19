let CURRENT_VERSE = '';

const checkVerseUpdate = async () => {
  const nextVerse = await fetchVerse();

  if (nextVerse && !CURRENT_VERSE.equalsTo(nextVerse)) {
    CURRENT_VERSE = nextVerse;
    console.log(CURRENT_VERSE);
    await updateControlVerse();
  }
};

const setVersionListeners = async () => {
  const versionSwitchers = document.querySelectorAll("#version input");

  if (versionSwitchers) {
    for (const option of versionSwitchers) {
      option.addEventListener(
        'change',
        async ({target}) => await changeVersion(target.dataset.id)
      );
    }
  }
}

const initialize = async () => {
  const {availableVersions, currentVersion} = await getAvailableVersions();

  const versions = document.querySelector("#version");
  versions.innerHTML = "";

  Object.keys(availableVersions).map(id => {
    const version = availableVersions[id];

    const input = document.createElement("input");
    input.dataset.id = id;
    input.id = version;
    input.type = "radio";
    input.name = "version";

    if (parseInt(currentVersion) === parseInt(id)) {
      input.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = version;
    label.innerHTML = version.toUpperCase();

    versions.appendChild(input);
    versions.appendChild(label);
  });

  await setVersionListeners();

  setInterval(async () => {
    await checkVerseUpdate();
  }, 200);
};

initialize();