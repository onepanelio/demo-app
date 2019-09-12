/* eslint-disable no-param-reassign */
import { createSlice } from 'redux-starter-kit';

const platformSlice = createSlice({
  slice: 'platform',
  initialState: {},
  reducers: {
    selectMode(state, action) {
      const { mode } = action.payload;
      state.mode = mode;
    },
    selectImageSource(state, action) {
      state.imageSource = action.payload;
    }
  }
});

export const { selectMode, selectImageSource } = platformSlice.actions;

export default platformSlice.reducer;
