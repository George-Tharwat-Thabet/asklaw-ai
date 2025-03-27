import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createConversation } from '../store/slices/chatSlice'

const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleStartNewChat = () => {
    // Create a new conversation and navigate to chat page
    dispatch(createConversation({ title: 'New Conversation' }))
    navigate('/chat')
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          AskLaw-AI
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your Intelligent Legal Advisor
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleStartNewChat}
          sx={{ mt: 2 }}
        >
          Start Asking Questions
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Instant Legal Guidance</Typography>
            <Typography variant="body1">
              Get immediate answers to your legal questions without the wait. Our AI-powered system provides quick responses based on relevant laws and regulations.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>24/7 Availability</Typography>
            <Typography variant="body1">
              Legal questions don't always arise during business hours. AskLaw-AI is available around the clock to provide guidance whenever you need it.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Simple Legal Language</Typography>
            <Typography variant="body1">
              We translate complex legal jargon into plain, understandable language, making legal concepts accessible to everyone.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>How It Works</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>1. Ask Your Question</Typography>
              <Typography variant="body1">
                Type your legal question in natural language, just as you would ask a lawyer.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>2. Get Instant Analysis</Typography>
              <Typography variant="body1">
                Our AI analyzes your question and searches through relevant legal information to provide an accurate response.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>3. Review & Take Action</Typography>
              <Typography variant="body1">
                Review the information provided and determine your next steps with confidence.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default HomePage