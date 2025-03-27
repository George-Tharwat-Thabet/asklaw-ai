import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ImportanceLevel = 'high' | 'medium' | 'low';

export interface LegalNote {
  id: string;
  text: string;
  importance: ImportanceLevel;
  conversationId: string;
  conversationTitle: string;
  timestamp: number;
  aiMessageId?: string;
}

interface LegalNotesState {
  notes: LegalNote[];
}

const initialState: LegalNotesState = {
  notes: [],
};

export const legalNotesSlice = createSlice({
  name: 'legalNotes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<LegalNote, 'id' | 'timestamp'>>) => {
      const newNote: LegalNote = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notes.push(newNote);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    updateNoteImportance: (state, action: PayloadAction<{ id: string; importance: ImportanceLevel }>) => {
      const { id, importance } = action.payload;
      const note = state.notes.find(note => note.id === id);
      if (note) {
        note.importance = importance;
      }
    },
  },
});

export const { addNote, deleteNote, updateNoteImportance } = legalNotesSlice.actions;

export default legalNotesSlice.reducer;