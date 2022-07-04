import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    changePasswordOpen: false,
    drawerOpen: true,
    newProjectOpen: false,
  },
  reducers: {
    openChangePassword: state => {
      state.changePasswordOpen = true;
    },
    closeChangePassword: state => {
      state.changePasswordOpen = false;
    },
    openNewProject: state => {
      state.newProjectOpen = true;
    },
    closeNewProject: state => {
      state.newProjectOpen = false;
    },
    toggleDrawer: state => {
      state.drawerOpen = !state.drawerOpen;
    }
  }
});

export const {
  openChangePassword, closeChangePassword, toggleDrawer, openNewProject, closeNewProject
} = layoutSlice.actions;
export const {reducer} = layoutSlice;
