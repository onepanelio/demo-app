import {
  AsyncStorage
} from 'react-native';

// eslint-disable-next-line no-underscore-dangle
export const storeData = async (key, data) => {
  const isObject = typeof data === 'object';
  try {
    await AsyncStorage.setItem(
      `@onepanel:${key}`,
      isObject ? JSON.stringify(data) : data
    );
  } catch (error) {
    throw new Error(`Uanable to save: ${key}`);
  }
};

// eslint-disable-next-line no-underscore-dangle
export const retrieveData = async (key, _default) => {
  const isObject = typeof _default === 'object';
  try {
    const value = await AsyncStorage.getItem(`@onepanel:${key}`);
    if (value !== null) {
      if (isObject) return JSON.parse(value);
      return value;
    }
  } catch (error) {
    throw new Error(`Uanable to retreive: ${key}`);
  }

  return _default;
};

export default { storeData, retrieveData };
