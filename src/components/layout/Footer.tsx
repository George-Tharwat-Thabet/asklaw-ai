import { Box, Container, Typography, Link } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} AskLaw-AI. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <strong>Disclaimer:</strong> AskLaw-AI is not a substitute for professional legal advice. 
          Always consult with a qualified attorney for specific legal matters.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer