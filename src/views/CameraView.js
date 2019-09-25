import React, { Component } from 'react';
import {
  View, Image, Dimensions
} from 'react-native';
import {
  Text,
  Button,
  Icon,
  Toast
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import BottomSheet from '../components/BottomSheet';
import Camera from '../components/Camera';
import Loader from '../components/Loader';


const options = {
  title: 'Select an image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const { width, height } = Dimensions.get('window');

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
    this.state = {
      processing: false, image: null, error: false, upload: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { image, srcImage } = props;

    if (state.processing) {
      const errornousResponse = (image === undefined || image.uri.indexOf('text/html') >= 0);
      return {
        image: srcImage === state.image && !errornousResponse ? image : state.image,
        processing: false,
        error: errornousResponse
      };
    }
    return {
      image,
      processing: (Boolean(state.image) && Boolean(image))
      && (state.image !== image && image !== null),
      error: false
    };
  }

  componentDidUpdate() {
    const { processImage } = this.props;
    const { image, processing, error } = this.state;
    if (processing && image) {
      processImage(image);
    }
    if (error) {
      Toast.show({
        text: 'Oops, Its looks like API is down',
        type: 'danger',
        position: 'bottom',
        duration: 5000
      });
    }
  }

  render() {
    const {
      onImageSelection = () => {},
      processVideo,
      sliceSize,
      type,
    } = this.props;
    const { image, processing, upload } = this.state;
    return (
      <>
        {processing ? <Loader loading={processing} /> : null}
        <View style={{ width: '100%', height: '100%' }}>
          {image ? (
            <ImageZoom
              cropWidth={width}
              cropHeight={height}
              imageWidth={width}
              imageHeight={height}
            >
              <Image
                source={image}
                style={{
                  width,
                  height,
                  flex: 1,
                }}
                resizeMode="contain"
              />
            </ImageZoom>
          ) : (
            <Camera
              upload={upload}
              videoSlice={processVideo}
              sliceSize={sliceSize}
            />
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
          {type === 'video' && (
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
              onPress={() => {
                this.setState({ upload: !upload });
              }}
            >
              <Icon
                type="Entypo"
                name="video-camera"
                active={upload}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  fontSize: 24,
                  color: upload ? 'grey' : 'red',
                }}
              />
            </Button>

          </View>
          )}
          {(type === 'both' || type === undefined) ? (
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
                disabled={processing}
                style={{ ...styles.cameraIcon }}
                onPress={async () => {
                  onImageSelection(null);
                  this.setState({ error: false });
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
                disabled={processing}
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
          ) : null}
        </View>
        {!image && type === 'both' ? (
          <BottomSheet>
            <Text>Result</Text>
          </BottomSheet>
        ) : null}
      </>
    );
  }
}
