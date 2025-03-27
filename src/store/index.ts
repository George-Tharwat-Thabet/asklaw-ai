import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slices/chatSlice'
import legalNotesReducer from './slices/legalNotesSlice'

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('chatState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Error loading state from localStorage:', err)
    return undefined
  }
}

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('chatState', serializedState)
  } catch (err) {
    console.error('Error saving state to localStorage:', err)
  }
}

// Get preloaded state
const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    legalNotes: legalNotesReducer,
  },
  preloadedState
})

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState({
    chat: store.getState().chat,
    legalNotes: store.getState().legalNotes
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch