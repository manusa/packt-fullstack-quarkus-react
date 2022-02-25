import React from 'react';
import {Link, useMatch} from 'react-router-dom';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Tooltip} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckIcon from '@mui/icons-material/Check';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import {HasRole} from '../auth';

const Item = ({Icon, title, to}) => {
  const match = Boolean(useMatch(to));
  return (
    <ListItem
      button component={Link}
      to={to} selected={match}
    >
      <Tooltip title={title} placement='right'><ListItemIcon><Icon /></ListItemIcon></Tooltip>
      <ListItemText primary={title} />
    </ListItem>
  )
};

export const MainDrawer = ({drawerOpen, toggleDrawer}) => (
  <Drawer
    open={drawerOpen} onClose={toggleDrawer} variant='permanent'
    sx={{
      width: theme => drawerOpen ? theme.layout.drawerWidth : theme.spacing(7),
      '& .MuiDrawer-paper': theme => ({
        width: theme.layout.drawerWidth,
        ...(!drawerOpen && {
          width: theme.spacing(7),
          overflowX: 'hidden'
        })
      })
  }}
  >
    <Toolbar />
    <List>
      <Item Icon={InboxIcon} title='Todo' to='/tasks/pending' />
      <Item Icon={CheckIcon} title='Completed' to='/tasks/completed'/>
      <Item Icon={AssignmentIcon} title='All' to='/tasks'/>
      <HasRole role='admin'>
        <Item Icon={PersonIcon} title='Users'  to='/users' />
      </HasRole>
    </List>
  </Drawer>
);
