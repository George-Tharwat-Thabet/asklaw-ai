# AskLaw-AI

AskLaw-AI is an intelligent web application designed to provide users with instant access to legal information and preliminary advice. By leveraging advanced AI technology, the platform enables users to get answers to their legal questions without the immediate need for a lawyer consultation.

## Project Overview

AskLaw-AI aims to democratize access to legal information by making it more accessible, understandable, and affordable for everyone. The application uses Google's Gemini AI to analyze legal questions and provide relevant information based on current laws, regulations, and legal precedents.

## Features

### AI-Powered Legal Chat
- Interactive chat interface for asking legal questions
- Jurisdiction-specific responses (customize legal advice based on region)
- Context-aware AI responses with relevant legal information
- Conversation history management

### Legal Notes System
- Save important information from AI responses as legal notes
- Categorize notes by importance level (high, medium, low)
- Search and filter saved notes
- Organize notes by conversation

### Text-to-Speech
- Listen to AI responses with built-in text-to-speech functionality
- Toggle speech on/off for accessibility

### Download Options
- Download AI responses as text files
- Export responses as PDF documents

### Important Points Cards
- Automatic extraction of key points from AI responses
- Visual display of important legal information in card format

### Persistent Storage
- Conversations and legal notes saved to local storage
- Resume conversations across browser sessions

## Technologies Used

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for improved development experience
- **Material UI**: Component library for consistent and responsive design
- **React Router**: Navigation and routing between pages

### State Management
- **Redux Toolkit**: State management for the application
- **Local Storage**: Persistent storage for conversations and notes

### AI Integration
- **Google Gemini API**: AI model for generating legal responses
- **Axios**: HTTP client for API requests

### Document Generation
- **jsPDF**: PDF generation for exporting responses

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/George-Tharwat-Thabet/asklaw-ai.git
cd asklaw-ai
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

AskLaw-AI is designed to provide general legal information and should not be considered as formal legal advice. Always consult with a qualified attorney for specific legal matters.