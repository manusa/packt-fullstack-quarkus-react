import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {IconButton, ListItemIcon, Menu, MenuItem, Tooltip} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from '../auth';
import {api} from '../users';

export const UserIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const {data} = api.endpoints.getSelf.useQuery();
  return (
    <>
      <Tooltip title='Profile'>
        <IconButton color='inherit' onClick={event => setAnchorEl(event.currentTarget)}>
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
      >
        {data && <MenuItem>{data.name}</MenuItem>}
        <MenuItem onClick={() => dispatch(logout())}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
