import React from 'react';
import {Layout} from './layout';
import {Container, Paper, Typography} from '@mui/material';

const Home = () =>
  <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Home
        </Typography>
      </Paper>
    </Container>
  </Layout>;

export default Home;
