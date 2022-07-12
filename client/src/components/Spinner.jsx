import React from 'react'
import { Box, CircularProgress } from '@mui/material';

const Spinner = (props) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: props.fullHeight ? '100vh' : '100%',
    }}>
      <CircularProgress />
    </Box>
  )
}

export default Spinner