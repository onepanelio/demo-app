import {
  retrieveData,
  storeData,
} from '../common/helpers/localStorage';

const settingsCache = {};

export const getApi = (key) => retrieveData(key, []).then((history) => {
  const selected = history.find((x) => x.isSelected);
  settingsCache[key] = { history, selected };
  return { history, selected };
});

export const storeApi = (key, value) => {
  const setting = settingsCache[key];
  let history = setting ? setting.history : [];
  const lastSelected = setting ? settingsCache[key].selected : null;
  const selectedNow = history.find((x) => x.url === value);
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

  return storeData(key, history);
};

export default { getApi, storeApi };
