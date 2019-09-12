/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';


// REDUX SECTION
import { configureStore } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import { Container, Content } from 'native-base';
import rootReducer from './src/modules/store';
import Main from './src/views/Main';
import Drawer from './src/components/Drawer';
import SideMenu from './src/views/SideMenu';


const store = configureStore({
  reducer: rootReducer,
});

const App = () => (
  <Provider store={store}>
    <Container>
      <Content>
        <Drawer>
          <SideMenu />
        </Drawer>
      </Content>
      <Main />
    </Container>
  </Provider>
);

export default App;
