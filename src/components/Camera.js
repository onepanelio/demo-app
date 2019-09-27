/* eslint-disable react/jsx-no-bind */
// This is an example code for the camera//
import React from 'react';
// import react in our code.
import {
  StyleSheet,
  View,
} from 'react-native';

import { RNCamera } from 'react-native-camera';

export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    return { upload: props.upload };
  }

  componentDidUpdate(props, state) {
    const {
      videoSlice = false,
      sliceSize, upload = false, close = () => {}
    } = this.props;
    if (videoSlice && upload && !state.upload) {
      this.recordVideoFor(sliceSize);
    } else if (this.camera && !videoSlice) {
      this.startLiveInferenceImageShot();
    }

    if (!upload && this.timer !== undefined) {
      clearTimeout(this.timer);
      if (this.camera) {
        this.camera.stopRecording();
      } else {
        close();
      }
      this.timer = undefined;
    }
  }

  startLiveInferenceImageShot() {
    const { capturedImage, sensitivity = 250 } = this.props;
    if (capturedImage) {
      this.camera.takePictureAsync({
        quality: 0.8
      }).then((image) => {
        capturedImage(image);
      }).catch((err) => {
        console.log(err);
      });

      this.liveInferenceTimer = setTimeout(() => {
        if (this.camera) {
          this.startLiveInferenceImageShot();
        }
      }, sensitivity);
    }
  }

  recordVideoFor(secs) {
    const { videoSlice, close = () => {} } = this.props;
    this.camera.recordAsync({
      quality: RNCamera.Constants.VideoQuality['480p']
    }).then((video) => {
      const { upload } = this.state;
      if (upload) {
        videoSlice(video);
        this.recordVideoFor(secs);
      }
    }).catch((err) => {
      console.log(err);
      close();
    });
    this.timer = setTimeout(() => {
      if (this.camera) {
        this.camera.stopRecording();
      } else {
        close();
      }
    }, secs * 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          captureAudio={false}
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
});
