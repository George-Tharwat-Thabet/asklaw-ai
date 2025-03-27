import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<{ title: string }>) => {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: action.payload.title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      state.conversations.push(newConversation)
      state.activeConversationId = newConversation.id
    },
    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload
      const conversation = state.conversations.find(conv => conv.id === id)
      if (conversation) {
        conversation.title = title
        conversation.updatedAt = Date.now()
      }
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      state.conversations = state.conversations.filter(conv => conv.id !== conversationId)
      
      // If the active conversation was deleted, set a new active conversation
      if (state.activeConversationId === conversationId) {
        state.activeConversationId = state.conversations.length > 0 ? state.conversations[0].id : null
      }
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload
    },
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      if (!state.activeConversationId) return
      
      const conversation = state.conversations.find(
        (conv) => conv.id === state.activeConversationId
      )
      
      if (conversation) {
        const newMessage: Message = {
          id: Date.now().toString(),
          ...action.payload,
          timestamp: Date.now(),
        }
        conversation.messages.push(newMessage)
        conversation.updatedAt = Date.now()
        
        // If this is the first user message and the title is still the default, generate a title
        if (action.payload.sender === 'user' && conversation.messages.length === 1 && conversation.title === 'New Conversation') {
          // Create a title from the first few words of the user's message
          const messageText = action.payload.text.trim()
          const titleText = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText
          conversation.title = titleText
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  createConversation,
  updateConversationTitle,
  deleteConversation,
  setActiveConversation,
  addMessage,
  setLoading,
  setError,
} = chatSlice.actions

export default chatSlice.reducer