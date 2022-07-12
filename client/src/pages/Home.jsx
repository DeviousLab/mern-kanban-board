import React, { useState } from 'react'
import { Box } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setBoards } from '../redux/features/boardSlice'
import boardApi from '../api/boardApi'

const Home = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createBoard = async () => {
    try {
      const response = await boardApi.create();
      dispatch(setBoards([response]));
      navigate(`/board/${response.id}`);
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <LoadingButton
        variant='contained'
        onClick={createBoard}
        loading={loading}
      >
        Create your first board
      </LoadingButton>
    </Box>
  )
}

export default Home