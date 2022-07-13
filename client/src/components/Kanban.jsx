import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import sectionApi from '../api/sectionApi'
import Spinner from '../components/Spinner'

const Kanban = (props) => {
  const boardId = props.boardId;
  console.log(props);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(props.data)
      setLoading(false)
    }, 1000);
    return () => clearTimeout(timer)
  }, [props.data])

  const onDragEnd = async ({ source, destination }) => {

  }

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      setData([...data, section])
    } catch (error) {
      alert(error)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter(el => el.id !== sectionId);
      setData(newData);
    } catch (error) {
      console.log(error)
    }
  }

  const updateSectionTitle = async (e, sectionId) => {
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex(el => el.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    try {
      await sectionApi.update(boardId, sectionId, { title: newTitle });
    } catch (error) {
      alert(error)
    }
  }

  const createTask = async (sectionId) => {
    
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Button onClick={createSection}>
          Add section
        </Button>
        <Typography variant='body2' fontWeight='700'>
          {data.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <DragDropContext >
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100vw - 400px)',
          overflowX: 'auto'
        }}>
          {
            data.map(section => (
              <div key={section.id} style={{ width: '300px' }}>
                <Droppable key={section.id} droppableId={section.id}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}>
                        <TextField
                          value={section.title}
                          placeholder='Untitled'
                          variant='outlined'
                          sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-input': { padding: 0 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                            '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                          }}
                          onChange={(e) => updateSectionTitle(e, section.id)}
                        />
                        <IconButton
                          variant='outlined'
                          size='small'
                          sx={{
                            color: 'gray',
                            '&:hover': { color: 'green' }
                          }}
                          onClick={() => createTask(section.id)}
                        >
                          <AddOutlinedIcon />
                        </IconButton>
                        <IconButton
                          variant='outlined'
                          size='small'
                          sx={{
                            color: 'gray',
                            '&:hover': { color: 'red' }
                          }}
                          onClick={() => deleteSection(section.id)}
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </Box>
                      {/* tasks */}
                      {
                        section.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: '10px',
                                  marginBottom: '10px',
                                  cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                }}
                              >
                                <Typography>
                                  {task.title === '' ? 'Untitled' : task.title}
                                </Typography>
                              </Card>
                            )}
                          </Draggable>
                        ))
                      }
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </div>
            ))
          }
        </Box>
      </DragDropContext>
    </>
  )
}

export default Kanban