import React from 'react';
import {Link} from 'react-router-dom';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Tooltip} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import {HasRole} from '../auth';

const Item = ({Icon, title, to}) => (
  <ListItem button component={Link} to={to}>
    <Tooltip title={title} placement='right'><ListItemIcon><Icon /></ListItemIcon></Tooltip>
    <ListItemText primary={title} />
  </ListItem>
)

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
      <Item Icon={InboxIcon} title='Todo' to='/tasks' />
      <Item Icon={CheckIcon} title='Completed' to='/tasks/completed'/>
      <HasRole role='admin'>
        <Item Icon={PersonIcon} title='Users'  to='/users' />
      </HasRole>
    </List>
  </Drawer>
);
