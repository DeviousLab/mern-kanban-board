import React, { useState } from 'react'
import { Box, Button, TextField, Alert, AlertTitle } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'

import authApi from '../api/authApi'

const SignIn = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');

    const data = new FormData(e.target);
    const username = data.get('username').trim();
    const password = data.get('password').trim();

    let error = false;
    if (username === '') {
      setUsernameErrText('Username is required');
      error = true;
    }
    if (password === '') {
      setPasswordErrText('Password is required');
      error = true;
    }
    if (error) return;
    setLoading(true);

    try {
      const res = await authApi.login({
        username,
        password,
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
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/register'
        sx={{ textTransform: 'none' }}
      >
        Don't have an account? Register Now!
      </Button>
      <Alert severity="info">
        <AlertTitle>Demo Account</AlertTitle>
        <strong>Username</strong>: demoaccount
        <br />
        <strong>Password</strong>: 12345678
      </Alert>
    </>
  )
}

export default SignIn