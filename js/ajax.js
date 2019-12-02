const post = async (url, objectData, errorMessage = 'Error sending post data', loaderSelector = '#loader') => {
  const method = 'POST';
  const body = new FormData();

  const loader = new LoaderController(loaderSelector);
  loader.enable();

  Object.keys(objectData).map(k => body.set(k, objectData[k]));

  const rawResponse = await fetch(url, { method, body });
  const responseClone = rawResponse.clone();

  try {
    return await rawResponse.json();
  } catch (reason) {
    console.error(errorMessage, reason);
    console.error(await responseClone.text());
  } finally {
    loader.disable();
  }
  return false;
}

const get = async (url, errorMessage = 'Error getting data', loaderSelector = '#loader') => {
  const rawResponse = await fetch(url);
  const responseClone = rawResponse.clone();

  let loader = { disable: () => {} };
  if (loaderSelector) {
    loader = new LoaderController(loaderSelector);
    loader.enable();
  }

  try {
    return await rawResponse.json();
  } catch (reason) {
    console.error('Error on fetching the Verse\n', reason);
    console.error(await responseClone.text());
  } finally {
    loader.disable();
  }
  return false;
}