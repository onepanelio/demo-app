/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Drawer } from 'native-base';

export default class DrawerExample extends Component {
  componentDidMount() {
    this.openDrawer();
  }

    closeDrawer = () => {
      this.drawer._root.close();
    };

openDrawer = () => { this.drawer._root.open(); };

render() {
  const { children } = this.props;
  return (
    <Drawer
      ref={(ref) => { this.drawer = ref; }}
      content={children}
      onClose={() => this.closeDrawer()}
    />
  );
}
}
