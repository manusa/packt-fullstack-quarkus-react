import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    drawerOpen: true,
    openTask: undefined
  },
  reducers: {
    newTask: (state) => {
      state.openTask = {};
    },
    clearOpenTask: (state) => {
      state.openTask = undefined;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {clearOpenTask, newTask, toggleDrawer} = layoutSlice.actions;
export const {reducer} = layoutSlice;
