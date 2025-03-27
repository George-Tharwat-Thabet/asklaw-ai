import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Typography, Box, Paper, Chip, IconButton, Grid, Card, CardContent, Divider, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import FlagIcon from '@mui/icons-material/Flag'
import { RootState } from '../store'
import { deleteNote, updateNoteImportance, ImportanceLevel } from '../store/slices/legalNotesSlice'

const LegalNotesPage = () => {
  const dispatch = useDispatch()
  const { notes } = useSelector((state: RootState) => state.legalNotes)
  
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('')
  const [importanceFilter, setImportanceFilter] = useState<string>('all')
  const [filteredNotes, setFilteredNotes] = useState(notes)

  // Update filtered notes when search query, importance filter, or notes change
  useEffect(() => {
    let filtered = [...notes]
    
    // Apply importance filter
    if (importanceFilter !== 'all') {
      filtered = filtered.filter(note => note.importance === importanceFilter)
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(note => 
        note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.conversationTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => b.timestamp - a.timestamp)
    
    setFilteredNotes(filtered)
  }, [notes, searchQuery, importanceFilter])

  // Handle importance filter change
  const handleImportanceFilterChange = (event: SelectChangeEvent) => {
    setImportanceFilter(event.target.value)
  }
  
  // Handle note deletion
  const handleDeleteNote = (noteId: string) => {
    dispatch(deleteNote(noteId))
  }
  
  // Handle importance level change
  const handleImportanceChange = (noteId: string, importance: ImportanceLevel) => {
    dispatch(updateNoteImportance({ id: noteId, importance }))
  }
  
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  // Get importance color
  const getImportanceColor = (importance: ImportanceLevel) => {
    switch (importance) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Legal Notes
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your saved legal notes from AI responses.
      </Typography>
      
      {/* Search and filter controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notes..."
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
        <FormControl variant="outlined" sx={{ minWidth: 150 }} size="small">
          <InputLabel id="importance-filter-label">Importance</InputLabel>
          <Select
            labelId="importance-filter-label"
            value={importanceFilter}
            onChange={handleImportanceFilterChange}
            label="Importance"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Notes display */}
      {notes.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You don't have any legal notes yet. Highlight important text in AI responses to add notes.
          </Typography>
        </Paper>
      ) : filteredNotes.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No notes match your search criteria. Try different filters.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} key={note.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Chip 
                        icon={<FlagIcon />}
                        label={note.importance.charAt(0).toUpperCase() + note.importance.slice(1)}
                        color={getImportanceColor(note.importance) as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={note.importance}
                          onChange={(e) => handleImportanceChange(note.id, e.target.value as ImportanceLevel)}
                          label="Importance"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteNote(note.id)}
                      aria-label="delete note"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {note.text}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      From: {note.conversationTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(note.timestamp)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default LegalNotesPage