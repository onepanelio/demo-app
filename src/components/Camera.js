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
    const { videoSlice, sliceSize, upload = false } = this.props;
    if (videoSlice && upload && !state.upload) {
      this.recordVideoFor(sliceSize);
    }
    return { upload };
  }

  recordVideoFor(secs) {
    const { videoSlice } = this.props;
    const { upload } = this.state;
    this.camera.recordAsync().then((video) => {
      videoSlice(video);
      if (upload) { this.recordVideoFor(secs); }
    });
    setTimeout(() => {
      this.camera.stopRecording();
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
          flashMode={RNCamera.Constants.FlashMode.on}
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
