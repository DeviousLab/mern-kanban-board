import React from 'react'
import { Box } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

const Home = () => {
  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <LoadingButton
        variant='contained'
        onAbort={createBoard}
      >
        Create your first board
      </LoadingButton>
    </Box>
  )
}

export default Home