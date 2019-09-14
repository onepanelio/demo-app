import React, { Component } from 'react';
import {
  View, Image, ScrollView, TextInput, Dimensions
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Body,
  Button,
  Icon,
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import AppHeader from '../components/AppHeader';
import BottomSheet from '../components/BottomSheet';
import Camera from '../components/Camera';

import onepanelImage from '../assets/onepanel.png';

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
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  panelHeader: {
    height: 32,
    backgroundColor: 'fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: '#aaa',
  },
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
      const source = { uri: response.uri };
      resolve(source.uri);
    }
  });
});

const getView = (type, that, image) => {
  switch (type) {
    case 'Image Pre-Processing':
    case 'Object Detection':
    case 'Object Classification':
      return (
        <>
          <View style={{ width: '100%', height: '100%' }}>
            {image ? (
              <Image
                source={{ uri: image }}
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
              borderColor: '#fff',
              borderWidth: 1,
              borderRadius: 20,
              top: 8,
              left: width / 2 - 50,
              right: 0,
              width: 120,
              height: 48,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,
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
                  that.setState({ image: null });
                }}
              >
                <Icon
                  name="camera"
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    fontSize: 24,
                    color: image == null ? 'red' : undefined,
                  }}
                />
              </Button>
              <Button
                transparent
                style={{ ...styles.cameraIcon }}
                onPress={async () => {
                  const pickedImage = await pickImage();
                  that.setState({ image: pickedImage });
                }}
              >
                <Icon
                  name="images"
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    fontSize: 24,
                    color: image == null ? undefined : 'red',
                  }}
                />
              </Button>
            </View>
          </View>
          <BottomSheet>
            <Text>Bottom Sheet Content</Text>
          </BottomSheet>
        </>
      );
    case 'Home':
    case 'About':
      return (
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              <Image
                source={onepanelImage}
                style={{ width: 200, flex: 1, alignSelf: 'center' }}
              />
              <Text style={{ lineHeight: 32 }}>
                Onepanel automates AI infrastructure and workflows, making it
                easy for AI teams to collaborate globally and deploy production
                ready solutions.
              </Text>
            </Body>
          </CardItem>
        </Card>
      );
    case 'Settings':
      return (
        <ScrollView scrollsToTop={false}>
          <Card>
            <CardItem header bordered>
              <Text>Object Detection API</Text>
            </CardItem>
            <CardItem>
              <TextInput
                style={{ height: 40, width: '100%' }}
                placeholder="ENTER API URL"
              />
            </CardItem>
            <CardItem>
              <Text style={styles.subtitle}>Recently Used</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api1.onepanel.io</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api2.onepanel.io</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api2.onepanel.io</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered>
              <Text>Object Classification API</Text>
            </CardItem>
            <CardItem>
              <TextInput
                style={{ height: 40, width: '100%' }}
                placeholder="ENTER API URL"
              />
            </CardItem>
            <CardItem>
              <Text style={styles.subtitle}>Recently Used</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api1.onepanel.io</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api2.onepanel.io</Text>
            </CardItem>
            <CardItem button bordered>
              <Text>https://api2.onepanel.io</Text>
            </CardItem>
          </Card>
        </ScrollView>
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

export default class AccordionExample extends Component {
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
        <Content contentContainerStyle={{ flexGrow: 1, position: 'relative' }}>
          {view}
        </Content>
      </Container>
    );
  }
}
