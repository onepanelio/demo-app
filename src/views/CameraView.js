import React, { Component } from 'react';
import {
  View, Image, Dimensions
} from 'react-native';
import {
  Text,
  Button,
  Icon,
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import BottomSheet from '../components/BottomSheet';
import Camera from '../components/Camera';
import Loader from '../components/Loader';


const options = {
  title: 'Select an image',
  customButtons: [{ name: 'Select', title: 'Choose Photo from gallery' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { width } = Dimensions.get('window');

const styles = {
  cameraIcon: {
    alignSelf: 'flex-end',
    paddingTop: 0,
    paddingBottom: 0,
    height: 35,
    width: 35,
    justifyContent: 'center',
    margin: 8,
  },
};

const pickImage = () => new Promise((resolve, reject) => {
  ImagePicker.showImagePicker(options, (response) => {
    if (response.didCancel) {
      reject(new Error('User cancelled image picker'));
    } else if (response.error) {
      reject(new Error('ImagePicker Error: ', response.error));
    } else if (response.customButton) {
      reject(
        new Error('User tapped custom button ')
      );
    } else {
      resolve(response);
    }
  });
});


export default class CameraView extends Component {
  constructor(props) {
    super(props);
    this.state = { processing: false };
  }

  static getDerivedStateFromProps(props, state) {
    const { image } = props;
    return image ? {
      image,
      // On New Image data, process the data
      processing: (state.image !== props.image) && !state.processing
    } : null;
  }

  componentDidUpdate({ processImage }, { image, processing }) {
    if (processing) {
      processImage(image);
    }
  }

  render() {
    const {
      onImageSelection = () => {},
    } = this.props;
    const { image, processing } = this.state;
    return (
      <>
        <Loader loading={processing} />
        <View style={{ width: '100%', height: '100%' }}>
          {image ? (
            <Image
              source={image}
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                alignSelf: 'center',
              }}
            />
          ) : (
            <Camera />
          )}
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            borderRadius: 20,
            top: 8,
            left: width / 2 - 50,
            right: 0,
            width: 120,
            height: 48,
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 4,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <Button
              transparent
              style={{ ...styles.cameraIcon }}
              onPress={async () => {
                onImageSelection(null);
              }}
            >
              <Icon
                type="Entypo"
                name="video-camera"
                active={!image}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  fontSize: 24,
                  color: image ? 'grey' : 'red',
                }}
              />
            </Button>
            <Button
              transparent
              style={{ ...styles.cameraIcon }}
              onPress={async () => {
                const selectedImage = await pickImage();
                onImageSelection(selectedImage);
              }}
            >
              <Icon
                type="Entypo"
                name="images"
                active={Boolean(image)}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  fontSize: 24,
                  color: image ? 'red' : 'grey',
                }}
              />
            </Button>
          </View>
        </View>
        <BottomSheet>
          <Text>Result</Text>
        </BottomSheet>
      </>
    );
  }
}
