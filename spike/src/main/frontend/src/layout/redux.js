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
    setOpenTask: (state, action) => {
      state.openTask = action.payload;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {clearOpenTask, newTask, setOpenTask, toggleDrawer} = layoutSlice.actions;
export const {reducer} = layoutSlice;
