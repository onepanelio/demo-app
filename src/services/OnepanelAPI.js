/* eslint-disable no-console */
import RNFetchBlob from 'rn-fetch-blob';

import uuidv4 from 'uuid/v4';

const config = {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
    'cache-control': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  },
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
};

export const ObjectDetection = (image, api = 'https://c.onepanel.io/onepanel-demo/projects/app-api/workspaces/app-api-v1/api/upload') => {
  const { fileName } = image;

  return RNFetchBlob.fetch('POST', api, {
    ...config.headers
  }, [{
    contentType: image.type,
    name: 'file',
    filename: fileName,
    data: image.data
  }]).then((res) => ({ uri: `data:${res.respInfo.headers['content-type']};base64,${res.data}` }))
    .catch(() => {
      // console.error(error);
    });
};

export const UploadDataset = (video, api = 'https://c.onepanel.io/onepanel-demo/projects/mobile-demo/workspaces/dataset-upload-api/api/upload/') => {
  const fileName = `${uuidv4()}-${Date.now()}.mp4`;

  return RNFetchBlob.fetch('POST', api, {
    ...config.headers
  }, [{
    contentType: 'video/mp4',
    name: 'file',
    filename: fileName,
    data: RNFetchBlob.wrap(video.uri)
  }]).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  });
};

export default { ObjectDetection, UploadDataset };
