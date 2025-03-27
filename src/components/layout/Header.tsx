import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'white' }}>
            AskLaw-AI
          </RouterLink>
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/chat">
            Chat
          </Button>
          <Button color="inherit" component={RouterLink} to="/history">
            History
          </Button>
          <Button color="inherit" component={RouterLink} to="/legal-notes">
            Legal Notes
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header