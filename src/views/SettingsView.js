import React, { Component } from 'react';
import {
  ScrollView,
  TextInput,
} from 'react-native';

import {
  Text,
  Card,
  CardItem,
} from 'native-base';

import {
  storeApi,
  getApi
} from '../services/SettingsStorageService';


const styles = {
  textInput: {
    width: '100%',
    color: '#FB8C00',
    borderRightWidth: 4,
    borderRightColor: '#01579B'
  },
  subtitle: {
    color: '#01579B'
  },
};

const History = ({ history = [], onSelect = () => {}, onEdit = () => {} }) => {
  let recentlyUsed = null;

  if (history.length > 0) {
    recentlyUsed = history.map((x) => {
      if (!x.isSelected) {
        return (
          <CardItem
            button
            onPress={() => onSelect(x.url)}
            onLongPress={() => onEdit(x.url)}
          >
            <Text style={{ fontSize: 12, color: '#bbb' }}>{x.url}</Text>
          </CardItem>
        );
      } return null;
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

const SettingCard = ({
  title, history, selected, onChange
}) => {
  const [value, onChangeText] = React.useState('');
  const defaultValue = selected ? selected.url : 'ENTER API URL HERE';

  return (
    <Card style={{ padding: 8 }}>
      <CardItem header bordered>
        <Text style={{ color: '#01579B' }}>{title}</Text>
      </CardItem>
      <CardItem>
        <TextInput
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          style={styles.textInput}
          placeholder={defaultValue}
          value={value}
          multiline
          onChangeText={(text) => onChangeText(text)}
          onEndEditing={() => {
            if (value.trim() !== '') {
              onChangeText('');
              onChange(value.trim());
            }
          }}
        />
      </CardItem>
      <History
        history={history}
        onSelect={(item) => {
          onChangeText('');
          onChange(item);
        }}
        onEdit={(item) => {
          onChangeText(item);
        }}
      />
    </Card>
  );
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ObjectDetectionHistory: [],
      ObjectDetectionHistorySelected: null,
      ObjectClassificationHistory: [],
      ObjectClassificationHistorySelected: null,
      UploadDatasetHistory: [],
      UploadDatasetHistorySelected: null,
    };
  }

  componentDidMount() {
    this.loadHistory('ObjectDetectionHistory');
    this.loadHistory('ObjectClassificationHistory');
    this.loadHistory('UploadDatasetHistory');
  }

  async loadHistory(key) {
    const { history, selected } = await getApi(key, []);
    this.setState({ [key]: history, [`${key}Selected`]: selected });
  }

  addNewAPI(key, value) {
    storeApi(key, value).then(() => {
      this.loadHistory(key);
    });
  }

  render() {
    const {
      ObjectDetectionHistory,
      ObjectDetectionHistorySelected,
      ObjectClassificationHistory,
      ObjectClassificationHistorySelected,
      UploadDatasetHistory,
      UploadDatasetHistorySelected,
    } = this.state;

    return (
      <ScrollView scrollsToTop={false}>
        <SettingCard
          title="Object Detection API"
          history={ObjectDetectionHistory}
          selected={ObjectDetectionHistorySelected}
          onChange={(value) => {
            this.addNewAPI('ObjectDetectionHistory', value);
          }}
        />
        <SettingCard
          title="Object Classification API"
          history={ObjectClassificationHistory}
          selected={ObjectClassificationHistorySelected}
          onChange={(value) => {
            this.addNewAPI('ObjectClassificationHistory', value);
          }}
        />
        <SettingCard
          title="Upload Dataset API"
          history={UploadDatasetHistory}
          selected={UploadDatasetHistorySelected}
          onChange={(value) => {
            this.addNewAPI('UploadDatasetHistory', value);
          }}
        />
      </ScrollView>
    );
  }
}
