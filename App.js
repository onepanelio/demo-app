/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';


// REDUX SECTION
import { configureStore } from 'redux-starter-kit';
import { Provider } from 'react-redux';

// Library
import SideMenu from 'react-native-side-menu';
import {
  Container,
  Root,
  StyleProvider
} from 'native-base';
import {
  StatusBar, Linking, Dimensions
} from 'react-native';
import rootReducer from './src/modules/store';

// Local
import Main from './src/views/Main';
import Menu from './src/views/SideMenu';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';

const store = configureStore({
  reducer: rootReducer,
});

const { width } = Dimensions.get('window');
export default class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      selectedItem: 'Home',
    };
  }

  onMenuItemSelected = (item) => {
    if (item === 'Feedback') {
      Linking.openURL('https://www.onepanel.io/contact');
    } 
    else if(item === 'Free AI POC') {
      Linking.openURL('https://www.onepanel.io/campaigns/free-aimodels-lead');
    }  else {
      this.setState({
        isOpen: false,
        selectedItem: item,
      });
    }
  };

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { selectedItem, isOpen } = this.state;
    const menu = (
      <Menu
        onItemSelected={this.onMenuItemSelected}
        selectedItem={selectedItem}
      />
    );
    return (
      <Root>
        <Provider store={store}>
          <StyleProvider style={getTheme(material)}>
            <Container>
              <SideMenu
                menu={menu}
                isOpen={isOpen}
                edgeHitWidth={width}
                onChange={(changedOpenState) => this.updateMenuState(changedOpenState)}
              >
                <StatusBar hidden />
                <Main toggleSideBar={() => this.toggle()} title={selectedItem} />
              </SideMenu>
            </Container>
          </StyleProvider>
        </Provider>
      </Root>
    );
  }
}
