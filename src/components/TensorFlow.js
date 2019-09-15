import { TfImageRecognition } from 'react-native-tensorflow';
// import RNFS from 'react-native-fs';
import apple from '../assets/apple.jpg';
import model from '../assets/tensorflow_inception_graph.pb';
import labels from '../assets/tensorflow_labels.txt';

// require the module

// // get a list of files and directories in the main bundle
// RNFS.readFileAssets('tensorflow_inception_graph.pb')
//   .then((result) => {
//     console.log('GOT RESULT', result);
//   })
//   .catch((err) => {
//     console.log(err.message, err.code);
//   });

const tfImageRecognition = new TfImageRecognition({
  model,
  labels,
  imageMean: 117, // Optional, defaults to 117
  imageStd: 1, // Optional, defaults to 1
});

export default () => {
  tfImageRecognition
    .recognize({
      image: apple,
      inputName: 'input', // Optional, defaults to "input"
      inputSize: 224, // Optional, defaults to 224
      outputName: 'output', // Optional, defaults to "output"
      maxResults: 3, // Optional, defaults to 3
      threshold: 0.1, // Optional, defaults to 0.1
    })
    .then((results) => {
      results.forEach((result) => console.log(
        result.id, // Id of the result
        result.name, // Name of the result
        result.confidence // Confidence value between 0 - 1
      ));
      tfImageRecognition.close();
    }).catch((e) => {
      console.log(e);
      tfImageRecognition.close();
    });
};
