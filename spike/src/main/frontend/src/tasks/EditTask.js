import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppBar, Box, Button, Container, Dialog, IconButton, TextField, Toolbar, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {api} from './api';
import {clearOpenTask} from '../layout';

export const EditTask = () => {
  const dispatch = useDispatch();
  const openTask = useSelector(state => state.layout.openTask);
  const dialogOpen = Boolean(openTask);
  const close = () => dispatch(clearOpenTask());
  const [addTask] = api.endpoints.addTask.useMutation();
  const save = event => {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) {
      const formData = new FormData(event.currentTarget);
      const task = Array.from(formData.entries())
        .reduce((t, [key, value]) => ({
        ...t,
        [key]: value,
      }), {});
      addTask(task).then(close);
    }
  };
  return (
    <Dialog
      fullScreen
      open={dialogOpen}
    >
      <Box component='form' onSubmit={save}>
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={close}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              New Task
            </Typography>
            <Button type='submit' color='inherit'>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{p: 2}}>
          <TextField
            fullWidth
            margin='normal'
            label='Title'
            name='title'
            required
            autoFocus
          />
          <TextField
            fullWidth
            margin='normal'
            label='Description'
            name='description'
            multiline
            rows={4}
          />
        </Container>
      </Box>
    </Dialog>
  );
};
