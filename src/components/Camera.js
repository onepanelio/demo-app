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

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
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
