import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { Box, IconButton, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import boardApi from '../api/boardApi'
import { setBoards } from '../redux/features/boardSlice'
import { setFavouriteList } from '../redux/features/favouriteSlice'
import EmojiPicker from '../components/EmojiPicker'
import Kanban from '../components/Kanban'

const Board = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState('');
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const boards = useSelector(state => state.board.value);
  const favouriteList = useSelector(state => state.favourites.value);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const response = await boardApi.getOne(boardId);
        setTitle(response.title);
        setDescription(response.description);
        setSection(response.sections);
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

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex(el => el.id === boardId);
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon };
      dispatch(setFavouriteList(tempFavourite));
    }

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

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex(el => el.id === boardId);
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle };
      dispatch(setFavouriteList(tempFavourite));
    }

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

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite });
      let newFavouriteList = [...favouriteList];
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter(el => el.id !== boardId);
      } else {
        newFavouriteList.unshift(board);
      }
      dispatch(setFavouriteList(newFavouriteList));
      setIsFavourite(!isFavourite);
    } catch (error) {
      alert(error)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId);
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter(el => el.id !== boardId);
        dispatch(setFavouriteList(newFavouriteList));
      }
      const newList = boards.filter(el => el.id !== boardId);
      if (newList.length === 0) {
        navigate('/');
      } else {
        navigate(`/board/${newList[0].id}`);
      }
      dispatch(setBoards(newList));
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
        <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
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
          <Kanban data={section} boardId={boardId} />
        </Box>
      </Box>
    </>
  )
}

export default Board