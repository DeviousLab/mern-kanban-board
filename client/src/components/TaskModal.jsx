import React, { useEffect, useRef, useState } from 'react'
import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import taskApi from '../api/taskApi'
import Spinner from './Spinner'
import './TaskModal.css'

let isModalClosed = false;

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const editorWrapperRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTask(props.task);
      setLoading(false);
      if (props.task !== undefined) {
        isModalClosed = false;
        updateEditorHeight();
      }
    }, 1000);
    setTitle(props.task !== undefined ? props.task.title : '');
    setContent(props.task !== undefined ? props.task.content : '');
    return () => clearTimeout(timer)
  }, [props.task])

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (error) {
      console.log(error)
    }
  }

  const updateTitle = async (e) => {
    const newTitle = e.target.value;
    setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (error) {
        alert(error)
      }
    }, 500)
    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  }

  const onClose = async () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  }

  const updateContent = async (event, editor) => {
    const data = editor.getData();
    if (!isModalClosed) {
      setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data })
        } catch (error) {
          alert(error)
        }
      }, 500);
      task.content = data;
      setContent(data);
      props.onUpdate(task);
    }
  }

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current
        box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
      }
    }, 500)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={{
          outline: 'none',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          bgcolor: 'background.paper',
          border: '0px solid #000',
          boxShadow: 24,
          p: 1,
          height: '80%'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton variant='outlined' color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            padding: '2rem 5rem 5rem'
          }}>
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px'
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
              ref={editorWrapperRef}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal