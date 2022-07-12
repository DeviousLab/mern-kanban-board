import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import authUtils from '../../utils/authUtils';
import Spinner from '../Spinner';
import Sidebar from '../Sidebar';
import { setUser } from '../../redux/features/userSlice';

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate('/login')
      } else {
        dispatch(setUser(user))
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate, dispatch])

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