import React from 'react';
import {Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import {api} from './api';
import {Layout} from '../layout';

export const Users = () => {
  const {data} = api.endpoints.getUsers.useQuery(undefined, {pollingInterval: 10000});
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper sx={{p: 2}}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map(user =>
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{new Date(user.created).toLocaleDateString()}</TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  </Layout>;
};
