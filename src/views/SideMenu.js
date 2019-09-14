import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
} from 'react-native';

import { List, ListItem, Left } from 'native-base';

import OnePanelHeading from '../assets/onepanel.png';
import menus from '../assets/subMenus.json';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 54,
    top: 16,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});

export default function Menu({ onItemSelected, selectedItem }) {
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={OnePanelHeading} />
        <Text style={styles.name}>Onepanel Demo Apis</Text>
      </View>
      <List>
        {menus.map((menu) => (
          <ListItem noIndent>
            <Left>
              <Text
                key={menu.title}
                onPress={() => onItemSelected(menu.title)}
                style={{
                  ...styles.item,
                  color: selectedItem === menu.title ? 'blue' : 'black',
                }}
              >
                {menu.title}
              </Text>
            </Left>
          </ListItem>
        ))}
      </List>
    </ScrollView>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};