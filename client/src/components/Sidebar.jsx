import React, { useState, useEffect } from 'react'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Link, useNavigate, useParams } from 'react-router-dom'

import assets from '../assets/index'
import boardApi from '../api/boardApi'
import { setBoards } from '../redux/features/boardSlice'
import FavouriteList from './FavouriteList'
import Spinner from './Spinner'

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user.value);
  const boards = useSelector(state => state.board.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();

  useEffect(() => {
    const getBoards = async () => {
      try {
        const response = await boardApi.getAll()
        dispatch(setBoards(response))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeItem = boards.findIndex(board => board.id === boardId)
      console.log(boards)
      if (boards.length > 0 && boardId === undefined) {
        navigate(`/board/${boards[0].id}`)
      };
      setActiveIndex(activeItem);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const onDragEnd = async ({ source, destination}) => {
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex(board => board.id === boardId);
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (error) {
      alert(error)
    }
  }

  const addBoard = async () => {
    try {
      const response = await boardApi.create();
      const newList = [response, ...boards];
      dispatch(setBoards(newList))
      navigate(`/board/${response.id}`);
    } catch (error) {
      alert(error)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: '250px',
        height: '100vh',
        '& > div': { borderRight: 'none' }
      }}
    >
      <List
        disablePadding
        sx={{
          width: '250px',
          height: '100vh',
          backgroundColor: assets.colors.secondary
        }}
      >
        <ListItem>
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='body2' fontWeight='700'>
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        <FavouriteList />
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant='body2' fontWeight='700'>
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {
                  boards.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <ListItemButton
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          selected={index === activeIndex}
                          component={Link}
                          to={`/board/${item.id}`}
                          sx={{
                            pl: '20px',
                            cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                          }}
                        >
                          <Typography
                            variant='body2'
                            fontWeight='700'
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {item.icon} {item.title}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  )
}

export default Sidebar