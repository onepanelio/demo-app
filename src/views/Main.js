import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
} from 'native-base';

import {
  AppState
} from 'react-native';

import AppHeader from '../components/AppHeader';

import Settings from './SettingsView';
import { getApi } from '../services/SettingsStorageService';

import About from './AboutView';
import CameraView from './CameraView';
import { ObjectDetection, UploadDataset } from '../services/OnepanelAPI';

import { process as ObjectDetectionLive, MODEL_NAMES } from '../modules/detection/ObjectDetection';

let videoCache = [];
const processVideo = (video, cache = true, api) => {
  if (cache) {
    videoCache.push(video);
  }
  if (videoCache.length > 0) {
    const nextVideo = videoCache.pop();
    if (nextVideo) {
      UploadDataset(nextVideo)
        .then(() => {
          processVideo(null, false, api);
        }).catch(() => {
          videoCache = [];
        });
    }
  }
};

const processImage = (type, selectedImage, that) => {
  if (selectedImage !== null) {
    const typeSettingsKey = `${type.replace(' ', '')}History`;
    getApi(typeSettingsKey)
      .then((settingValue) => ObjectDetection(selectedImage,
        settingValue.selected ? settingValue.selected.url : undefined))
      .then((responseImage) => that.setState({ image: responseImage, srcImage: selectedImage }));
  }
};

const getView = (type, that, image) => {
  switch (type) {
    case 'Upload Dataset':
      return (
        <CameraView
          type="video"
          sliceSize={4}
          processVideo={(video) => {
            const typeSettingsKey = `${type.replace(' ', '')}History`;
            getApi(typeSettingsKey)
              .then((settingValue) => processVideo(video, true,
                settingValue.selected ? settingValue.selected.url : undefined));
          }}
        />
      );
    case 'Object Detection':
      return (
        <CameraView
          key={type}
          type="both"
          srcImage={that.state.srcImage}
          image={image}
          output={that.state.output}

          detectObjectsLive={(frame) => {
            if (!image) {
              ObjectDetectionLive(frame, MODEL_NAMES.ssd).then((output) => {
                that.setState({ output });
              });
            }
          }}

          onImageSelection={(selectedImage) => {
            that.setState(
              { image: selectedImage, srcImage: null },
              processImage(type, selectedImage, that)
            );
          }}

        />
      );
    case 'Object Classification':
      return (
        <CameraView
          key={type}
          type="both"
          srcImage={that.state.srcImage}
          image={image}
          output={that.state.output}

          detectObjectsLive={(frame) => {
            if (!image) {
              ObjectDetectionLive(frame, MODEL_NAMES.mobile).then((output) => {
                that.setState({ output });
              });
            }
          }}

          onImageSelection={(selectedImage) => {
            that.setState(
              { image: selectedImage, srcImage: null },
              processImage(type, selectedImage, that)
            );
          }}
        />
      );
    case 'Home':
    case 'About':
      return <About />;
    case 'Settings':
      return (
        <Settings />
      );
    case 'Rate us':
      return (
        <Text>
This is
          {' '}
          {type}
          {' '}
Screen
        </Text>
      );
    default:
      return <Text>Nothing to show</Text>;
  }
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { image: null, appState: AppState.currentState };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    const { title, toggleSideBar } = this.props;
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (title === 'Object Detection' || title === 'Object Classification') { toggleSideBar(); }
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    const { toggleSideBar, title } = this.props;
    const { image, appState } = this.state;

    if (appState !== 'active') {
      return null;
    }

    const view = getView(title, this, image);

    return (
      <Container>
        <AppHeader openDrawer={toggleSideBar} title={title} />
        <Content
          padder={title === 'Home' || title === 'About' || title === 'Settings'}
          contentContainerStyle={{ flexGrow: 1, position: 'relative' }}
        >
          {appState === 'active' ? view : null}
        </Content>
      </Container>
    );
  }
}
