import React, {useState} from 'react';
import {
  Box, Toolbar
} from '@mui/material';
import {TopBar} from './TopBar';
import {MainDrawer} from './MainDrawer';

export const Layout = ({children}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  return (
    <Box sx={{display: 'flex'}}>
      <TopBar toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      <MainDrawer toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      <Box>
        <Toolbar />
        <Box component='main'>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
