import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import {useForm} from '../useForm';
import {closeChangePassword} from '../layout';
import {api} from './';


export const ChangePasswordDialog = ({}) => {
  const {values, invalid, isValid, onChange} = useForm({
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const changePasswordOpen = useSelector(state => state.layout.changePasswordOpen);
  const close = () => dispatch(closeChangePassword());
  const [changePassword] = api.endpoints.changePassword.useMutation();
  const canSave = isValid && Boolean(values.currentPassword) && Boolean(values.newPassword);
  const save = () => {
    changePassword(values).then(({error}) => {
      if (!Boolean(error)) {
        close();
      } else if (error?.status === 409) {
          setError("Current password is incorrect");
      } else {
        setError("Unknown error, please try again");
      }
    });
  };
  return (
    <Dialog open={changePasswordOpen} onClose={close}>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Change your user password.
        </DialogContentText>
        {Boolean(error) && <Alert severity='error'>{error}</Alert>}
        <TextField
          autoFocus
          fullWidth
          margin='dense'
          variant='standard'
          type='password'
          label='Current password'
          name='currentPassword'
          value={values.currentPassword}
          onChange={onChange}
          error={Boolean(invalid.currentPassword)}
          required
        />
        <TextField
          fullWidth
          margin='dense'
          variant='standard'
          type='password'
          label='New password'
          name='newPassword'
          value={values.newPassword}
          onChange={onChange}
          error={Boolean(invalid.newPassword)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={save} disabled={!canSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
