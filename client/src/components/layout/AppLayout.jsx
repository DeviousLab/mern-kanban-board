import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom'

import authUtils from '../../utils/authUtils';
import Spinner from '../Spinner';
import Sidebar from '../Sidebar';

const AppLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate('/login')
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate])

  return (
    loading ? (
      <Spinner fullHeight />
    ) : (
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ 
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          <Outlet />
        </Box>
      </Box>
    )
  )
}

export default AppLayout