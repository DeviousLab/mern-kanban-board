import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import boardApi from '../api/boardApi'
import { setBoards } from '../redux/features/boardSlice'
import EmojiPicker from '../components/EmojiPicker'

const Board = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState('');
  const { boardId } = useParams();
  const dispatch = useDispatch();
  
  const boards = useSelector(state => state.board.value);

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
      }
    }
    getBoard();
  }, [boardId]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex(el => el.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };
    setIcon(newIcon);
    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (error) {
      alert(error)
    }
  }

  const onTitleChange = async (e) => {
    const newTitle = e.target.value;
    let temp = [...boards];
    const index = temp.findIndex(el => el.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };
    setTitle(newTitle);
    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { title: newTitle });
    } catch (error) {
      alert(error)
    }
  }

  const onDescriptionChange = async (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    try {
      await boardApi.update(boardId, { description: newDescription });
    } catch (error) {
      alert(error)
    }
  }

  

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
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            onChange={onTitleChange}
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
            onChange={onDescriptionChange}
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