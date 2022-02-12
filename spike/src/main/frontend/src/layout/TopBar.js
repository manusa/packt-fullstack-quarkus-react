import React from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, IconButton, Toolbar, Tooltip, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {UserIcon} from './UserIcon';

export const TopBar = ({toggleDrawer}) => {
  const navigate = useNavigate();
  return (
    <AppBar
      position='fixed'
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Tooltip title='Home'>
          <IconButton
            color='inherit'
            onClick={() => navigate('/')}
          >
            <HomeOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task manager
        </Typography>
        <Tooltip title='Quick Add'>
          <IconButton color="inherit">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <UserIcon />
      </Toolbar>
    </AppBar>
  );
};
