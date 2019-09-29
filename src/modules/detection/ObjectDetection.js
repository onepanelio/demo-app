/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Image, Text, View, StyleSheet,
  Dimensions, PixelRatio
} from 'react-native';
import Tflite from 'tflite-react-native';

import RNFS from 'react-native-fs';

const dimension = Dimensions.get('window');
const sheightInPx = PixelRatio.getPixelSizeForLayoutSize(dimension.height);
const swidthInPx = PixelRatio.getPixelSizeForLayoutSize(dimension.width);
const density = PixelRatio.get();

const tflite = new Tflite();
let isModelSelected = false;
const blue = '#25d5fd';
const mobile = 'MobileNet';
const ssd = 'SSD MobileNet';
const yolo = 'Tiny YOLOv2';
const deeplab = 'Deeplab';
const posenet = 'PoseNet';
let loadingModel = false;

let modelLoaded = null;

export const MODEL_NAMES = {
  mobile,
  ssd,
  yolo,
  deeplab,
  posenet,
  loadingModel
};

export const loadModel = (model = yolo) => {
  if (!isModelSelected) {
    loadingModel = true;
    onSelectModel(model).then((res) => {
      loadingModel = false;
      modelLoaded = model;
      isModelSelected = true;
    });
  }
};

const onImageSelection = (path, model = modelLoaded) => new Promise((resolve, reject) => {
  switch (model) {
    case ssd:
      tflite.detectObjectOnImage({
        path,
        threshold: 0.2,
        numResultsPerClass: 1,
      },
      (err, res) => {
        if (err) { console.log(err); reject(err); } else { this.resolve({ recognitions: res }); }
      });
      break;

    case yolo:
      tflite.detectObjectOnImage({
        path,
        model: 'YOLO',
        imageMean: 0.0,
        imageStd: 255.0,
        threshold: 0.4,
        numResultsPerClass: 1,
      },
      (err, res) => {
        if (err) { console.log(err); reject(err); } else { resolve({ recognitions: res }); }
      });
      break;

    case deeplab:
      tflite.runSegmentationOnImage({
        path
      },
      (err, res) => {
        if (err) { console.log(err); reject(err); } else { resolve({ recognitions: res }); }
      });
      break;

    case posenet:
      tflite.runPoseNetOnImage({
        path,
        threshold: 0.8
      },
      (err, res) => {
        if (err) { console.log(err); reject(err); } else { resolve({ recognitions: res }); }
      });
      break;

    default:
      tflite.runModelOnImage({
        path,
        imageMean: 128.0,
        imageStd: 128.0,
        numResults: 3,
        threshold: 0.05
      },
      (err, res) => {
        if (err) { console.log(err); reject(err); } else { resolve({ recognitions: res }); }
      });
  }
});

const onSelectModel = (model) => new Promise((resolve, reject) => {
  let modelFile;
  let labelsFile;
  switch (model) {
    case ssd:
      modelFile = 'models/ssd_mobilenet.tflite';
      labelsFile = 'models/ssd_mobilenet.txt';
      break;
    case yolo:
      modelFile = 'models/yolov2_tiny.tflite';
      labelsFile = 'models/yolov2_tiny.txt';
      break;
    case deeplab:
      modelFile = 'models/deeplabv3_257_mv_gpu.tflite';
      labelsFile = 'models/deeplabv3_257_mv_gpu.txt';
      break;
    case posenet:
      modelFile = 'models/posenet_mv1_075_float_from_checkpoints.tflite';
      labelsFile = '';
      break;
    default:
      modelFile = 'models/mobilenet_v1_1.0_224.tflite';
      labelsFile = 'models/mobilenet_v1_1.0_224.txt';
  }
  tflite.loadModel({
    model: modelFile,
    labels: labelsFile,
  },
  (err, res) => {
    if (err) { reject(err); } else { resolve(res); }
  });
});

export const process = async (image, model = yolo) => {
  const timeStamp = Date.now();
  loadModel(model);
  if (loadingModel || modelLoaded === null) return { view: null, timeStamp };
  const res = await onImageSelection(image.uri);
  RNFS.unlink(image.uri);
  return {
    view: renderResults(res.recognitions,
      image.width / density, image.height / density, image.deviceOrientation),
    timeStamp
  };
};

function renderResults(recognitions, imageWidth, imageHeight, orientation, model = modelLoaded) {
  const h = dimension.height - 56;
  const w = dimension.width;
  switch (model) {
    case ssd:
    case yolo:
      return recognitions.map((res, id) => {
        const left = res.rect.x * w;
        const top = res.rect.y * h;
        const width = res.rect.w * w;
        const height = res.rect.h * h;
        return (
          <View
            // eslint-disable-next-line react/no-array-index-key
            key={id}
            style={[styles.box, {
              top, left, width, height
            }]}
          >
            <Text style={{ color: 'white', backgroundColor: blue }}>
              {`${res.detectedClass} ${(res.confidenceInClass * 100).toFixed(0)}%`}
            </Text>
          </View>
        );
      });
    case deeplab:
      return (
        recognitions.length > 0
          ? (
            <Image
              style={{ flex: 1, width: w, height: h }}
              source={{ uri: `data:image/png;base64,${recognitions}` }}
              opacity={0.6}
            />
          ) : undefined
      );

    case posenet:
      return recognitions.map((res) => Object.values(res.keypoints).map((k, id) => {
        const left = k.x * w - 6;
        const top = k.y * h - 6;
        const width = w;
        const height = h;
        return (
          <View
            // eslint-disable-next-line react/no-array-index-key
            key={id}
            style={{
              position: 'absolute', top, left, width, height
            }}
          >
            <Text style={{ color: blue, fontSize: 12 }}>
              {`● ${k.part}`}
            </Text>
          </View>
        );
      }));

    default:
      return recognitions.map((res, id) => (
        // eslint-disable-next-line react/no-array-index-key
        <Text key={id} style={{ color: 'black' }}>
          {`${res.label}-${(res.confidence * 100).toFixed(0)}%`}
        </Text>
      ));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  imageContainer: {
    borderColor: blue,
    borderRadius: 5,
    alignItems: 'center'
  },
  text: {
    color: blue
  },
  button: {
    width: 200,
    backgroundColor: blue,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 15
  },
  box: {
    position: 'absolute',
    borderColor: blue,
    borderWidth: 2,
  },
  boxes: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }
});

export default process;
