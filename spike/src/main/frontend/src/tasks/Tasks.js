import React from 'react';
import {useDispatch} from 'react-redux';
import {
  Box,
  Button,
  Container,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {api} from './api';
import {Layout, newTask} from '../layout';

export const Tasks = () => {
  const dispatch = useDispatch();
  const {data} = api.endpoints.getTasks.useQuery(undefined, {pollingInterval: 10000});
  const [setComplete] = api.endpoints.setComplete.useMutation();
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper sx={{p: 2}}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Tasks
        </Typography>
        <Table size='small'>
          <TableBody>
            {data && Array.from(data).sort((a, b) => a.id - b.id).map(task =>
              <TableRow key={task.id}>
                <TableCell sx={{width: '2rem'}}>
                  <Checkbox
                    checked={Boolean(task.complete)}
                    checkedIcon={<CheckCircleIcon fontSize='small' />}
                    icon={<RadioButtonUncheckedIcon fontSize='small' />}
                    onChange={() => setComplete({task, complete: !Boolean(task.complete)})}
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{mt: 2}}>
          <Button startIcon={<AddIcon />} onClick={() => dispatch(newTask())}>
            Add task
          </Button>
        </Box>
      </Paper>
    </Container>
  </Layout>;
};
