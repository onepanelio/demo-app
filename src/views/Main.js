import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
} from 'native-base';

import AppHeader from '../components/AppHeader';

import Settings from './SettingsView';
import About from './AboutView';
import CameraView from './CameraView';
// import TensorFlow from '../components/TensorFlow';
import { ObjectDetection, UploadDataset } from '../services/OnepanelAPI';

const getView = (type, that, image) => {
  switch (type) {
    case 'Upload Dataset':
      return (
        <CameraView
          type="video"
          sliceSize={4}
          processVideo={(video) => {
            UploadDataset(video);// , that[`${type.replace(' ', '')}API`])
          }}
        />
      );
    case 'Object Detection':
    case 'Object Classification':
      return (
        <CameraView
          type="both"
          srcImage={that.state.srcImage}
          image={image}
          processImage={(imageToProcess) => {
            ObjectDetection(imageToProcess)// , that[`${type.replace(' ', '')}API`])
              .then((responseImage) => {
                that.setState({ image: responseImage, srcImage: imageToProcess });
              });
          }}
          onImageSelection={(selectedImage) => {
            that.setState({ image: selectedImage, srcImage: null });
          }}
        />
      );
    case 'Home':
    case 'About':
      return <About />;
    case 'Settings':
      return (
        <Settings settingsUpdate={(key, value) => {
          that.setState({ [key]: value });
        }}
        />
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
    this.state = { image: null };
  }

  render() {
    const { toggleSideBar, title } = this.props;
    const { image } = this.state;
    const view = getView(title, this, image);
    return (
      <Container>
        <AppHeader openDrawer={toggleSideBar} title={title} />
        <Content
          padder={title === 'Home' || title === 'About' || title === 'Settings'}
          contentContainerStyle={{ flexGrow: 1, position: 'relative' }}
        >
          {view}
        </Content>
      </Container>
    );
  }
}
