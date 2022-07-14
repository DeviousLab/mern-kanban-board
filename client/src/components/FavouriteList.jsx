import React, { useEffect, useState } from 'react'
import { Box, ListItem, ListItemButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import boardApi from '../api/boardApi'
import { setFavouriteList } from '../redux/features/favouriteSlice'
import Spinner from '../components/Spinner'

const FavouriteList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { boardId } = useParams();

  const list = useSelector(state => state.favourites.value);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const response = await boardApi.getFavourites();
        dispatch(setFavouriteList(response));
      } catch (error) {
        alert(error);
      }
    }
    getBoards();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const index = list.findIndex(e => e.id === boardId);
      setActiveIndex(index);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer)
  }, [boardId, list])

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...list]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e.id === boardId)
    setActiveIndex(activeItem)
    dispatch(setFavouriteList(newList))

    try {
      await boardApi.updateFavouritePosition({ boards: newList })
    } catch (err) {
      alert(err)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <ListItem>
        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='body2' fontWeight='700'>
            Favourites
          </Typography>
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {
                list.map((item, index) => (
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
    </>
  )
}

export default FavouriteList