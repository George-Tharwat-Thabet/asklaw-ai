import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'
import LegalNotesPage from './pages/LegalNotesPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/legal-notes" element={<LegalNotesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App