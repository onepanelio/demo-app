/* eslint-disable no-console */
import FormData from 'form-data';

const config = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    Authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
    'cache-control': 'no-cache',
    'Postman-Token': '23423423423423',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  },
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
};
export const ObjectDetection = (image, api) => {
  const form = new FormData();
  const buffer = Buffer.from(image, 'binary');
  const fileName = 'test.txt';

  form.append('file', buffer, {
    contentType: 'text/plain',
    name: 'file',
    filename: fileName,
  });
  fetch(api, {
    ...config,
    data: form
  }).then((response) => response.json())
    .then((updatedImage) => updatedImage)
    .catch((error) => {
      console.error(error);
    });
};

export default { ObjectDetection };
