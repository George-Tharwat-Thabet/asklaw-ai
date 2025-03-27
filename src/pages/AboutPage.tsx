import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material'

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        About AskLaw-AI
      </Typography>
      <Typography variant="body1" paragraph>
        AskLaw-AI is an intelligent web application designed to provide users with instant access to legal information and preliminary advice. By leveraging advanced AI technology and a comprehensive database of laws, the platform enables users to get answers to their legal questions without the immediate need for a lawyer consultation.
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          Our mission is to democratize access to legal information by making it more accessible, understandable, and affordable for everyone. We believe that understanding your legal rights and obligations should not be a privilege, but a fundamental right.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h5" gutterBottom>
          How We Work
        </Typography>
        <Typography variant="body1" paragraph>
          AskLaw-AI uses advanced artificial intelligence to analyze your legal questions and provide relevant information based on current laws, regulations, and legal precedents. Our system is continuously updated to ensure accuracy and relevance.
        </Typography>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                AI-Powered Legal Responses
              </Typography>
              <Typography variant="body2">
                Our platform leverages GPT-4 technology to understand complex legal questions and provide accurate, context-aware responses with citations to relevant laws and regulations.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Comprehensive Legal Database
              </Typography>
              <Typography variant="body2">
                We maintain an extensive database of local and global laws, regulations, and precedents that is regularly updated to reflect changes in legislation.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                User-Friendly Interface
              </Typography>
              <Typography variant="body2">
                Our clean, intuitive web interface makes it easy to submit legal questions and receive responses in a conversational format that's easy to understand.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                24/7 Availability
              </Typography>
              <Typography variant="body2">
                Legal questions don't always arise during business hours. Our platform is available around the clock to provide guidance whenever you need it.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mt: 4, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Important Disclaimer
        </Typography>
        <Typography variant="body1">
          AskLaw-AI provides information and preliminary guidance only, not professional legal advice. The platform is designed to help you understand legal concepts and identify potential issues, but it is not a substitute for consultation with a qualified attorney. Always consult with a legal professional for specific legal matters.
        </Typography>
      </Paper>
    </Container>
  )
}

export default AboutPage