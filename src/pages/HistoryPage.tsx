import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Divider, IconButton, TextField, InputAdornment, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import FilterListIcon from '@mui/icons-material/FilterList'
import { RootState } from '../store'
import { setActiveConversation, deleteConversation } from '../store/slices/chatSlice'
import { useNavigate } from 'react-router-dom'

const HistoryPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { conversations } = useSelector((state: RootState) => state.chat)
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredConversations, setFilteredConversations] = useState(conversations)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)

  // Update filtered conversations when search query or conversations change
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If no search query, just sort the conversations
      const sorted = [...conversations].sort((a, b) => {
        return sortOrder === 'newest' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
      })
      setFilteredConversations(sorted)
    } else {
      // Filter conversations based on search query
      const filtered = conversations.filter(conv => {
        // Search in title
        if (conv.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true
        }
        
        // Search in messages
        return conv.messages.some(msg => 
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      
      // Sort filtered conversations
      const sorted = [...filtered].sort((a, b) => {
        return sortOrder === 'newest' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
      })
      
      setFilteredConversations(sorted)
    }
  }, [searchQuery, conversations, sortOrder])
  
  const handleConversationClick = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId))
    navigate('/chat')
  }
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
  }
  
  // Handle delete conversation
  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation() // Prevent triggering the conversation click
    setConversationToDelete(conversationId)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = () => {
    if (conversationToDelete) {
      dispatch(deleteConversation(conversationToDelete))
    }
    setDeleteDialogOpen(false)
    setConversationToDelete(null)
  }
  
  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setConversationToDelete(null)
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get conversation summary
  const getConversationSummary = (conversation: any) => {
    if (conversation.messages.length === 0) return 'No messages';
    
    // Find the first user message
    const firstUserMessage = conversation.messages.find((msg: any) => msg.sender === 'user');
    if (firstUserMessage) {
      // Truncate if too long
      return firstUserMessage.text.length > 60 
        ? firstUserMessage.text.substring(0, 60) + '...' 
        : firstUserMessage.text;
    }
    
    return 'No user messages';
  }
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Conversation History
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage your previous legal consultations.
      </Typography>
      
      {/* Search and filter controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <Button 
          variant="outlined" 
          startIcon={<SortIcon />}
          onClick={toggleSortOrder}
          size="small"
        >
          {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
        </Button>
      </Box>

      <Paper elevation={2} sx={{ mt: 3 }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              You don't have any conversations yet. Start a new conversation in the Chat section.
            </Typography>
          </Box>
        ) : filteredConversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No conversations match your search. Try different keywords.
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredConversations.map((conversation, index) => (
              <Box key={conversation.id}>
                {index > 0 && <Divider />}
                <ListItem 
                  button 
                  onClick={() => handleConversationClick(conversation.id)}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, conversation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {conversation.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(conversation.updatedAt)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ width: '100%', mb: 1 }}>
                    {getConversationSummary(conversation)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      size="small" 
                      label={`${conversation.messages.length} messages`} 
                      variant="outlined" 
                    />
                    <Chip 
                      size="small" 
                      label="Chat" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
      >
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default HistoryPage