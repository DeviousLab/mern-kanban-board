import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'

import boardApi from '../api/boardApi'
import { setBoards } from '../redux/features/boardSlice'

const Board = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState('');
  const { boardId } = useParams();

  useEffect(() => {
    const getBoard = async () => {
      try {
        const response = await boardApi.getOne(boardId);
        setTitle(response.title);
        setDescription(response.description);
        setSection(response.section);
        setIsFavourite(response.favourite);
        setIcon(response.icon);
      } catch (error) {
        alert(error)
        console.log(error);
      }
    }
    getBoard();
  }, [boardId]);

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <IconButton variant='outlined'>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error'>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <TextField
            value={title}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
        </Box>
      </Box>
    </>
  )
}

export default Board