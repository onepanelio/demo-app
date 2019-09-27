import React from 'react';

import {
  Header, Left, Button, Icon, Right, Body, Title
} from 'native-base';

export default (props) => {
  const { title = 'Home' } = props;
  return (
    <Header style={{ backgroundColor: '#01579B' }}>
      <Left>
        <Button transparent onPress={() => props.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right />
    </Header>
  );
};
