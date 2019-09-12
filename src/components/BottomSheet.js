import React, { Component } from 'react';
import { Text, Card, CardItem } from 'native-base';

import {
  Dimensions, StyleSheet
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    marginLeft: 8,
    marginRight: 8,
  },
  panelHeader: {
    height: 32,
    backgroundColor: 'fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class AccordionExample extends Component {
  render() {
    const { children } = this.props;
    return (
      <SlidingUpPanel
        ref={(c) => { this.panel = c; }}
        draggableRange={{ top: height / 1.75, bottom: 48 }}
        animatedValue={this.draggedValue}
        showBackdrop={false}
      >
        <Card style={styles.panel}>
          <CardItem style={styles.panelHeader} header>
            <Text style={{ color: '#000' }}>Results</Text>
          </CardItem>
          <CardItem>{children}</CardItem>
        </Card>
      </SlidingUpPanel>
    );
  }
}
