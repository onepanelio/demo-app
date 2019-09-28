import React from 'react';
import {
  Text,
  Spinner,
  View
} from 'native-base';

export default ({ message }) => (
  <View
    style={{
      flex: 1,
      position: 'absolute',
      zIndex: 110,
      top: '50%',
      alignSelf: 'center',
    }}
  >
    <Spinner color="blue" />
    <Text style={{ color: 'white' }}>
      {message}
    </Text>
  </View>
);
