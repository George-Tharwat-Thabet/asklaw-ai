import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Popover, Typography } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useDispatch, useSelector } from 'react-redux';
import { addNote } from '../store/slices/legalNotesSlice';
import { RootState } from '../store';

interface TextSelectionPopupProps {
  selectedText: string;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  conversationId: string;
  conversationTitle: string;
  aiMessageId?: string;
}

const TextSelectionPopup: React.FC<TextSelectionPopupProps> = ({
  selectedText,
  anchorPosition,
  onClose,
  conversationId,
  conversationTitle,
  aiMessageId
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(Boolean(anchorPosition));

  // Handle saving the note with different importance levels
  const handleSaveNote = (importance: 'high' | 'medium' | 'low') => {
    if (selectedText.trim()) {
      dispatch(addNote({
        text: selectedText.trim(),
        importance,
        conversationId,
        conversationTitle,
        aiMessageId
      }));
      
      // Close the popup after saving
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  // Update open state when anchorPosition changes
  React.useEffect(() => {
    setOpen(Boolean(anchorPosition));
  }, [anchorPosition]);

  if (!anchorPosition) return null;

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ? { 
        top: anchorPosition.top, 
        left: anchorPosition.left 
      } : undefined}
      onClose={handleClose}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 1.5, maxWidth: 300 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Save as legal note:
        </Typography>
        <ButtonGroup variant="contained" size="small" fullWidth>
          <Button 
            onClick={() => handleSaveNote('high')} 
            color="error"
            startIcon={<BookmarkAddIcon />}
          >
            High
          </Button>
          <Button 
            onClick={() => handleSaveNote('medium')} 
            color="warning"
            startIcon={<BookmarkAddIcon />}
          >
            Medium
          </Button>
          <Button 
            onClick={() => handleSaveNote('low')} 
            color="success"
            startIcon={<BookmarkAddIcon />}
          >
            Low
          </Button>
        </ButtonGroup>
      </Box>
    </Popover>
  );
};

export default TextSelectionPopup;