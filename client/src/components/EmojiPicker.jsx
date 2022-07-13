import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const EmojiPicker = (props) => {
  const [emoji, setEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setEmoji(props.icon);
  }, [props.icon]);

  const selectEmoji = (e) => {
    const sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach(el => codesArray.push('0x' + el))
    const emote = String.fromCodePoint(...codesArray);
    setShowEmojiPicker(false);
    props.onChange(emote);
  };
  
  const showPicker = () => setShowEmojiPicker(!showEmojiPicker);

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant='h3'
        fontWeight='700'
        sx={{ cursor: 'pointer' }}
        onClick={showPicker}
      >
        {emoji}
      </Typography>
      <Box sx={{
        display: showEmojiPicker ? 'block' : 'none',
        position: 'absolute',
        top: '100%',
        zIndex: '9999'
      }}>
        <Picker theme='dark' onSelect={selectEmoji} showPreview={false} />
      </Box>
    </Box>
  )
}



export default EmojiPicker