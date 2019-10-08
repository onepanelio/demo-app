/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
// This is an example code for the camera//
import React from 'react';
// import react in our code.
import {
  StyleSheet,
  View,
  AppState
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import SystemSetting from 'react-native-system-setting';

let currentVolume = null;
// get the current volume

// listen the volume changing if you need
let volumeListener = null;

const updateVolume = () => {
  SystemSetting.getVolume().then((volume) => {
    currentVolume = volume;
    console.log(`Current volume is ${volume}`);
  });
  if (volumeListener) {
    SystemSetting.removeVolumeListener(volumeListener);
  }
  volumeListener = SystemSetting.addVolumeListener((data) => {
    currentVolume = data.value;
    console.log(currentVolume);
  });
};


export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    updateVolume();
    AppState.addEventListener('change', this.handleAppStateChange);
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

  componentWillUnmount() {
    // remove listener when you need it no more
    SystemSetting.removeVolumeListener(volumeListener);
    SystemSetting.setVolume(currentVolume);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }


  static getDerivedStateFromProps(props) {
    return { upload: props.upload };
  }

  handleAppStateChange = (nextAppState) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      updateVolume();
    } else {
      SystemSetting.setVolume(currentVolume);
    }
    this.setState({ appState: nextAppState });
  }

  startLiveInferenceImageShot() {
    const { capturedImage, sensitivity = 300 } = this.props;
    if (capturedImage && this.camera) {
      // change the volume
      SystemSetting.setVolume(0);
      this.camera.takePictureAsync({
        width: 240,
        quality: 0.8,
        fixOrientation: true,
        orientation: 'portrait',
        forceUpOrientation: true
      }).then((image) => {
        capturedImage(image);
      }).catch((err) => {
        console.log(err);
      });

      this.liveInferenceTimer = setTimeout(() => {
        this.startLiveInferenceImageShot();
      }, sensitivity);
    }
  }

  recordVideoFor(secs) {
    const { videoSlice, close = () => {} } = this.props;
    if (this.camera) {
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
  }

  render() {
    return (
      <View style={styles.container}>
        {(
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
        )}
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
