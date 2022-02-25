import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    changePasswordOpen: false,
    drawerOpen: true,
    openTask: undefined
  },
  reducers: {
    openChangePassword: state => {
      state.changePasswordOpen = true;
    },
    closeChangePassword: state => {
      state.changePasswordOpen = false;
    },
    newTask: state => {
      state.openTask = {};
    },
    clearOpenTask: state => {
      state.openTask = undefined;
    },
    setOpenTask: (state, action) => {
      state.openTask = action.payload;
    },
    toggleDrawer: state => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {
  openChangePassword, closeChangePassword, clearOpenTask, newTask, setOpenTask, toggleDrawer
} = layoutSlice.actions;
export const {reducer} = layoutSlice;
