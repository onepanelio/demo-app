import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native';

export default () => (
  <ScrollView>
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ margin: 10, fontSize: 20, textAlign: 'center' }}>One Panel</Text>
    </View>
    <FlatList
      data={[{ key: 'd' }, { key: 'b' }]}
      keyExtractor={(x) => x}
      renderItem={({ item }) => <Text>{item.key}</Text>}
    />
  </ScrollView>
);
