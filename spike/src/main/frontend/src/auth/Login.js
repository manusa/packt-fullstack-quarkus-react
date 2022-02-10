import React from 'react';
import {Avatar, Box, Button, Container, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useDispatch} from 'react-redux';
import {login} from './redux';
import {useNavigate} from 'react-router-dom';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(login({name: data.get('username'), password: data.get('password')}))
      .then(({meta}) => {
        if (meta.requestStatus === 'fulfilled') {
          navigate('/');
        }
      });
  };
  return (
    <Container maxWidth='xs'>
      <Box sx={{mt: theme => theme.spacing(8), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Avatar sx={{m: 1}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={submit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
