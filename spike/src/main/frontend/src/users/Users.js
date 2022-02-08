import React from 'react';
import {Container, Paper, Typography} from '@mui/material';
import {Layout} from '../layout';
import {userApi} from './api';

export const Users = () => {
  const {data} = userApi.endpoints.getUsers.useQuery(undefined, {pollingInterval: 10000});
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Users
        </Typography>
        <ul>
          {data && data.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      </Paper>
    </Container>
  </Layout>;
};
