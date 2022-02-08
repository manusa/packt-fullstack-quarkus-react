import React from 'react';
import {Layout} from './layout';
import {Button, Container, Paper, Typography} from '@mui/material';
import {userApi} from './users/api';

const Home = () => {
  const [trigger, {data}] = userApi.endpoints.getUsers.useLazyQuery();
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Home
        </Typography>
        <Button onClick={() => trigger()}>Trigger!</Button>
        <ul>
        {data && data.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      </Paper>
    </Container>
  </Layout>;
};

export default Home;
