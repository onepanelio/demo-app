import React from 'react';
import {
  Image,
} from 'react-native';
import {
  Text,
  Card,
  CardItem,
  Body,
} from 'native-base';

import onepanelImage from '../assets/onepanel.png';

export default () => (
  <Card style={{ flex: 0 }}>
    <CardItem>
      <Body>
        <Image
          source={onepanelImage}
          style={{ width: 200, flex: 1, alignSelf: 'center' }}
        />
        <Text style={{ lineHeight: 32 }}>
          Onepanel automates AI infrastructure and workflows, making it easy for
          AI teams to collaborate globally and deploy production ready
          solutions.
        </Text>
      </Body>
    </CardItem>
  </Card>
);
