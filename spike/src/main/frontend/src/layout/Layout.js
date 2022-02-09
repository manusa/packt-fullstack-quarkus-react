import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Box, Toolbar
} from '@mui/material';
import {toggleDrawer} from './redux';
import {TopBar} from './TopBar';
import {MainDrawer} from './MainDrawer';

export const Layout = ({children}) => {
  const drawerOpen = useSelector(state => state.layout.drawerOpen);
  const dispatch = useDispatch();
  const doToggleDrawer = () => dispatch(toggleDrawer());
  return (
    <Box sx={{display: 'flex'}}>
      <TopBar toggleDrawer={doToggleDrawer} drawerOpen={drawerOpen} />
      <MainDrawer toggleDrawer={doToggleDrawer} drawerOpen={drawerOpen} />
      <Box sx={{flex: 1}}>
        <Toolbar />
        <Box component='main'>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
