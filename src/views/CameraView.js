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
    const { image = state.image, srcImage } = props;

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
      processing: (state.image !== image && image !== null),
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

  componentWillUnmount() {
    this.setState({ upload: false });
  }

  updateTimer() {
    const { upload } = this.state;
    if (upload) {
      let { hour, minutes, seconds } = this.timer;
      if (seconds === 59) {
        seconds = 0;
        if (minutes === 59) {
          minutes = 0;
          hour += 1;
        } else {
          minutes += 1;
        }
      } else {
        seconds += 1;
      }

      const timerText = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      this.timer = {
        hour,
        minutes,
        seconds
      };

      this.setState({ videoTimer: timerText }, () => {
        setTimeout(() => this.updateTimer(), 1000);
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
    const {
      image, processing, upload, videoTimer
    } = this.state;
    return (
      <>
        {processing ? <Loader loading={processing} /> : null}
        <View style={{ width: '100%', height: '100%' }}>
          {image && type !== 'video' ? (
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
              close={() => this.setState({ upload: false })}
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
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Button
              transparent
              style={{ flex: 1, grow: 0, justifyContent: upload ? 'flex-end' : 'center' }}
              onPress={() => {
                if (!upload && this.toast) {
                  this.toast.hide();
                }
                this.toast = Toast.show({
                  text: !upload ? 'Recording started.' : 'Recording stopped.',
                  type: !upload ? 'success' : 'danger',
                  position: 'bottom',
                  duration: !upload ? (1000 * 60 * 60 * 1000) : 5000
                });
                // eslint-disable-next-line no-shadow
                this.setState({ upload: !upload }, () => {
                  // eslint-disable-next-line react/destructuring-assignment
                  if (this.state.upload) {
                    this.timer = {
                      hour: 0,
                      minutes: 0,
                      seconds: 0
                    };
                    this.updateTimer();
                  }
                });
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
                  color: upload ? '#FB8C00' : '#E0E0E0',
                }}
              />
              {upload ? (<Text>{videoTimer}</Text>) : null}
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
                    color: image ? '#E0E0E0' : '#FB8C00',
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
                    color: image ? '#FB8C00' : '#E0E0E0'
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
