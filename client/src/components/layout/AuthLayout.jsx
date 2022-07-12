import React, { useState, useEffect } from 'react'
import { Container, Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom'

import authUtils from '../../utils/authUtils';
import Spinner from '../Spinner';
import assets from '../../assets';

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
      } else {
        navigate('/');
      }
    }
    checkAuth();
  }, [navigate])

  return (
    loading ? (
      <Spinner fullHeight />
    ) : (
      <Container component='main' max-width='xs'>
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img src={assets.images.darkLogo} alt='kanban logo' style={{ width: '200px' }} />
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout