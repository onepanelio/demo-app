import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Accordion,
  Text,
  Card,
  CardItem,
  Left,
  Body,
  Form,
  Item,
  Label,
  Input,
  Subtitle,
  Button,
  Icon,
  Right,
} from 'native-base';

import { AsyncStorage } from 'react-native';

const styles = {
  textInput: { height: 40, width: '100%' },
  subtitle: {
    color: '#aaa',
  },
};

const History = ({ history = [], onSelect = () => {}, onEdit = () => {} }) => {
  let recentlyUsed = null;

  if (history.length > 0) {
    recentlyUsed = history.map(x => {
      if (!x.isSelected) {
        return (
          <CardItem
            button
            bordered
            onPress={() => onSelect(x.url)}
            onLongPress={() => onEdit(x.url)}>
            <Text>{x.url}</Text>
          </CardItem>
        );
      } else return null;
    });
  }

  return history.length > 0 ? (
    <>
      <CardItem>
        <Text style={styles.subtitle}>Recently Used</Text>
      </CardItem>
      {recentlyUsed}
    </>
  ) : null;
};

const _storeData = async (key, data) => {
  const isObject = typeof data === 'object';
  try {
    await AsyncStorage.setItem(
      `@onepanel:${key}`,
      isObject ? JSON.stringify(data) : data
    );
  } catch (error) {
    // Error saving data
  }
};

const _retrieveData = async (key, _default) => {
  const isObject = typeof _default === 'object';
  try {
    const value = await AsyncStorage.getItem(`@onepanel:${key}`);
    if (value !== null) {
      if (isObject) return JSON.parse(value);
      else return value;
    }
  } catch (error) {
    // Error retrieving data
    console.log(error);
  }

  return _default;
};

const SettingCard = ({ title, history, selected, onChange }) => {
  const [value, onChangeText] = React.useState('');
  const defaultValue = selected ? selected.url : 'ENTER API URL HERE';

  return (
    <Card>
      <CardItem header bordered>
        <Text>{title}</Text>
      </CardItem>
      <CardItem>
        <TextInput
          style={styles.textInput}
          placeholder={defaultValue}
          value={value}
          onChangeText={text => onChangeText(text)}
          onEndEditing={() => {
            if (value.trim() != '') {
              onChangeText('');
              onChange(value.trim());
            }
          }}
        />
      </CardItem>
      <History
        history={history}
        onSelect={item => {
          onChangeText('');
          onChange(item);
        }}
        onEdit={item => {
          onChangeText(item);
        }}
      />
    </Card>
  );
};

export default class Settings extends Component {
  state = {
    ObjectDetectionHistory: [],
    ObjectDetectionHistorySelected: null,
    ObjectClassificationHistory: [],
    ObjectClassificationHistorySelected: null,
  };

  getHistory(key) {
    _retrieveData(key, []).then(history => {
      let selected = history.find(x => x.isSelected);
      this.setState({ [key]: history, [`${key}Selected`]: selected });
    });
  }

  componentDidMount() {
    this.getHistory('ObjectDetectionHistory');
    this.getHistory('ObjectClassificationHistory');
  }

  addNewAPI(key, value) {
    let history = this.state[key];
    const lastSelected = history.find(x => x.isSelected);
    const selectedNow = history.find(x => x.url == value);
    if (lastSelected) {
      lastSelected.isSelected = false;
    }

    if (selectedNow) {
      selectedNow.isSelected = true;
    } else {
      history = [
        {
          url: value,
          isSelected: true,
        },
        ...history.slice(0, 3),
      ];
    }

    _storeData(key, history).then(() => {
      this.getHistory(key);
    });
  }

  render() {
    const { children } = this.props;
    const {
      ObjectDetectionHistory,
      ObjectDetectionHistorySelected,
      ObjectClassificationHistory,
      ObjectClassificationHistorySelected,
    } = this.state;

    return (
      <ScrollView scrollsToTop={false}>
        <SettingCard
          title={'Object Detection API'}
          history={ObjectDetectionHistory}
          selected={ObjectDetectionHistorySelected}
          onChange={value => {
            this.addNewAPI('ObjectDetectionHistory', value);
          }}
        />
        <SettingCard
          title={'Object Classification API'}
          history={ObjectClassificationHistory}
          selected={ObjectClassificationHistorySelected}
          onChange={value => {
            this.addNewAPI('ObjectClassificationHistory', value);
          }}
        />
      </ScrollView>
    );
  }
}
