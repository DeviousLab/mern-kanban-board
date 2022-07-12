import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'

import authApi from '../api/authApi'

const SignUp = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');
    setConfirmPasswordErrText('');

    const data = new FormData(e.target);
    const username = data.get('username').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();

    let error = false;
    if (username === '') {
      setUsernameErrText('Username is required');
      error = true;
    }
    if (password === '') {
      setPasswordErrText('Password is required');
      error = true;
    }
    if (confirmPassword === '') {
      setConfirmPasswordErrText('Confirmed password is required');
      error = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErrText('Passwords do not match');
      error = true;
    }
    if (error) return;
    setLoading(true);
    try {
      const res = await authApi.register({
        username,
        password,
        confirmPassword
      })
      setLoading(false);
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      const errMsg = err.data.errors;
      errMsg.forEach(err => {
        if (err.param === 'username') {
          setUsernameErrText(err.msg);
        } 
        if (err.param === 'password') {
          setPasswordErrText(err.msg);
        }
        if (err.param === 'confirmPassword') {
          setConfirmPasswordErrText(err.msg);
        }
      })
      setLoading(false);
    }
  }

  return (
    <>
      <Box
        component='form'
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Register
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/login'
        sx={{ textTransform: 'none' }}
      >
        Already have an account? Login!
      </Button>
    </>
  )
}

export default SignUp