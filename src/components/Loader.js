import React from 'react';
import {
  Text,
  Spinner,
  View
} from 'native-base';

export default ({ loading }) => (
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
      {`Finding ${loading ? '...' : 'Done'}`}
    </Text>
  </View>
);
