import React from 'react';
import {AppBar, IconButton, Toolbar, Tooltip, Typography} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';

export const TopBar = ({toggleDrawer}) => (
  <AppBar
    position='fixed'
    sx={{
      zIndex: theme => theme.zIndex.drawer + 1
    }}
  >
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Task manager
      </Typography>
      <Tooltip title='Quick Add'>
        <IconButton color="inherit">
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Profile'>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
);
