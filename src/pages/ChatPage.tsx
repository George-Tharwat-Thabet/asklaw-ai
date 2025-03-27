import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress, Divider, MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip, Menu, Switch, FormControlLabel } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DownloadIcon from '@mui/icons-material/Download'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import { addMessage, createConversation, setLoading, setError, updateConversationTitle } from '../store/slices/chatSlice'
import { downloadMessage, speakMessage, getImportantPointsFromLatestAIMessage } from '../utils'
import ImportantPointsCards from '../components/ImportantPointsCards'
import TextSelectionPopup from '../components/TextSelectionPopup'
import { RootState } from '../store'
import { geminiApiService } from '../services'

const ChatPage = () => {
  const dispatch = useDispatch()
  const { conversations, activeConversationId, isLoading, error } = useSelector(
    (state: RootState) => state.chat
  )
  const [userInput, setUserInput] = useState('')
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Text selection state
  const [selectedText, setSelectedText] = useState('')
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null)

  // Find the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId)

  // Create a new conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(createConversation({ title: 'New Conversation' }))
    }
  }, [dispatch, conversations.length])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const [jurisdiction, setJurisdiction] = useState('general')
  const [showImportantPoints, setShowImportantPoints] = useState(false)
  const [importantPoints, setImportantPoints] = useState<string[]>([])
  
  // Update important points when messages change
  useEffect(() => {
    if (showImportantPoints && activeConversation?.messages) {
      const points = getImportantPointsFromLatestAIMessage(activeConversation.messages);
      setImportantPoints(points);
    }
  }, [activeConversation?.messages, showImportantPoints])
  

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || !activeConversationId) return

    // Add user message to the conversation
    dispatch(addMessage({ text: userInput, sender: 'user' }))
    
    // Clear input field
    setUserInput('')
    
    // Set loading state
    dispatch(setLoading(true))
    
    try {
      // Show a loading message to indicate we're processing the request
      dispatch(addMessage({
        text: 'Searching for legal information and generating response...',
        sender: 'ai'
      }))
      
      // Use the standard text format
      const geminiResponse = await geminiApiService.generateResponse(userInput, jurisdiction)
      
      if (geminiResponse.success) {
        // Format the response for display
        const formattedResponse = geminiApiService.formatResponse(geminiResponse.data.text)
        
        // Add the response to the conversation
        dispatch(addMessage({
          text: formattedResponse.text,
          sender: 'ai'
        }))
        
        // Update important points if enabled
        if (showImportantPoints) {
          const updatedConversation = conversations.find(conv => conv.id === activeConversationId);
          if (updatedConversation) {
            const points = getImportantPointsFromLatestAIMessage([...updatedConversation.messages, {
              id: Date.now().toString(),
              text: formattedResponse.text,
              sender: 'ai',
              timestamp: Date.now()
            }]);
            setImportantPoints(points);
          }
        }
      } else {
        // API failed - provide a helpful fallback response
        const fallbackResponse = `I apologize, but I was unable to retrieve legal information at this time. 

For questions about worker law in the United States, you might want to consult resources like the Department of Labor website (www.dol.gov) or seek advice from a qualified employment attorney.

For general legal questions, please try again later or consider rephrasing your question to be more specific.`;
        
        dispatch(addMessage({
          text: fallbackResponse,
          sender: 'ai'
        }))
      }
      
      dispatch(setLoading(false))
    } catch (err) {
      dispatch(setError('Failed to get response from AI'))
      dispatch(setLoading(false))
    }
  }

  // Helper function to render message content
  const renderMessageContent = (message: { text: string }) => {
    return (
      <Typography 
        variant="body1" 
        sx={{ 
          '& strong': { fontWeight: 'bold' },
          '& em': { fontStyle: 'italic' },
          '& p': { mb: 1 },
          '& ul, & ol': { pl: 2, mb: 1 },
          '& li': { mb: 0.5 }
        }}
        dangerouslySetInnerHTML={{ 
          __html: message.text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
            .replace(/\*\*_([^*_]+)_\*\*/g, '<strong><em>$1</em></strong>')
        }}
      />
    )
  }

  // Handle text-to-speech
  const handleSpeak = (message: any) => {
    if (speakingMessageId === message.id) {
      // Stop speaking if already speaking this message
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      // Start speaking the new message
      speakMessage(message);
      setSpeakingMessageId(message.id);
      
      // Reset speaking state when speech ends
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.onend = () => setSpeakingMessageId(null);
      
      // Also reset if the browser tab is hidden/inactive
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.speechSynthesis.cancel();
          setSpeakingMessageId(null);
        }
      }, { once: true });
    }
  };
  
  // Download menu state
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const isDownloadMenuOpen = Boolean(downloadAnchorEl);
  
  // Handle download button click
  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>, message: any) => {
    setDownloadAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };
  
  // Handle download menu close
  const handleDownloadMenuClose = () => {
    setDownloadAnchorEl(null);
  };
  
  // Handle download in specific format
  const handleDownload = (format: 'txt' | 'pdf') => {
    if (selectedMessage) {
      downloadMessage(selectedMessage, format);
      handleDownloadMenuClose();
    }
  };
  
  // Handle text selection
  const handleTextSelection = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      // Only show popup for AI messages
      const target = event.target as HTMLElement;
      const messageElement = target.closest('.ai-message');
      
      if (messageElement) {
        const selectedText = selection.toString().trim();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Set the position for the popup
        setSelectedText(selectedText);
        setSelectionPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    } else {
      // Clear selection state if no text is selected
      setSelectedText('');
      setSelectionPosition(null);
    }
  };
  
  // Handle closing the text selection popup
  const handleCloseTextSelectionPopup = () => {
    setSelectedText('');
    setSelectionPosition(null);
  };

  return (
    <Container maxWidth="md">
      {/* Download Options Menu */}
      <Menu
        anchorEl={downloadAnchorEl}
        open={isDownloadMenuOpen}
        onClose={handleDownloadMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => handleDownload('txt')} sx={{ gap: 1 }}>
          <TextSnippetIcon fontSize="small" />
          Download as TXT
        </MenuItem>
        <MenuItem onClick={() => handleDownload('pdf')} sx={{ gap: 1 }}>
          <PictureAsPdfIcon fontSize="small" />
          Download as PDF
        </MenuItem>
      </Menu>
      <Paper elevation={3} sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {activeConversation ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {isEditingTitle ? (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  autoFocus
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  onClick={() => {
                    if (titleInput.trim()) {
                      dispatch(updateConversationTitle({ id: activeConversation.id, title: titleInput }))
                      setIsEditingTitle(false)
                    }
                  }}
                  color="primary"
                  size="small"
                >
                  <CheckIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  {activeConversation.title}
                </Typography>
                <IconButton 
                  onClick={() => {
                    setTitleInput(activeConversation.title)
                    setIsEditingTitle(true)
                  }}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="h5" gutterBottom>
            Legal Consultation
          </Typography>
        )}
        <Divider sx={{ mb: 2 }} />
        
        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, p: 2 }}>
          {activeConversation?.messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
                width: '100%',
              }}
            >
              <Paper
                elevation={1}
                className={message.sender === 'ai' ? 'ai-message' : ''}
                onMouseUp={message.sender === 'ai' ? handleTextSelection : undefined}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  width: 'auto',
                  bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  position: 'relative',
                }}
              >
                {renderMessageContent(message)}
                
                {/* Only show action buttons for AI messages */}
                {message.sender === 'ai' && (
                  <Box sx={{ 
                    display: 'flex', 
                    position: 'absolute', 
                    top: '5px', 
                    right: '5px',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '4px',
                  }}>
                    <Tooltip title="Download response">
                      <IconButton 
                        size="small" 
                        onClick={(event) => handleDownloadClick(event, message)}
                        sx={{ color: 'primary.main' }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={speakingMessageId === message.id ? "Stop speaking" : "Read aloud"}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleSpeak(message)}
                        sx={{ color: speakingMessageId === message.id ? 'error.main' : 'primary.main' }}
                      >
                        {speakingMessageId === message.id ? 
                          <VolumeOffIcon fontSize="small" /> : 
                          <VolumeUpIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
          
          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          {/* Error message */}
          {error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
        </Box>
        
        {/* Input Area */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
            <FormControl variant="outlined" sx={{ minWidth: 120, mr: 1 }}>
              <InputLabel id="jurisdiction-select-label">Jurisdiction</InputLabel>
              <Select
                labelId="jurisdiction-select-label"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                label="Jurisdiction"
                disabled={isLoading}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="us">United States</MenuItem>
                <MenuItem value="eu">European Union</MenuItem>
                <MenuItem value="uk">United Kingdom</MenuItem>
                <MenuItem value="canada">Canada</MenuItem>
                <MenuItem value="australia">Australia</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showImportantPoints}
                  onChange={(e) => setShowImportantPoints(e.target.checked)}
                  color="primary"
                  disabled={isLoading}
                />
              }
              label="Show Important Points"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask your legal question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={isLoading || !userInput.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Important Points Cards */}
      {showImportantPoints && importantPoints.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <ImportantPointsCards points={importantPoints} />
        </Box>
      )}
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        Disclaimer: AskLaw-AI provides information for educational purposes only and is not a substitute for professional legal advice.
      </Typography>
      
      {/* Text Selection Popup */}
      {activeConversation && (
        <TextSelectionPopup
          selectedText={selectedText}
          anchorPosition={selectionPosition}
          onClose={handleCloseTextSelectionPopup}
          conversationId={activeConversation.id}
          conversationTitle={activeConversation.title}
          aiMessageId={selectedMessage?.id}
        />
      )}
    </Container>
  )
}

export default ChatPage