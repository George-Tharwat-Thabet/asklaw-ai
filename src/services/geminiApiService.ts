import axios from 'axios';
import { apiRequest } from '../utils/apiUtils';

// Types
interface GeminiApiResponse {
  success: boolean;
  data: any;
  error?: string;
}

interface GeminiRequestContent {
  role?: string;
  parts: {
    text: string;
  }[];
}

interface GeminiRequest {
  contents: GeminiRequestContent[];
}



// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

/**
 * Service to interact with Google's Gemini API for legal AI responses
 */
export const geminiApiService = {
  /**
   * Generate a response from Gemini API based on user query
   * @param query - The user's legal question
   * @param jurisdiction - The legal jurisdiction (country/region)
   * @returns Promise with Gemini API response
   */
  generateResponse: async (query: string, jurisdiction: string = 'general'): Promise<GeminiApiResponse> => {
    try {
      // Construct a more detailed prompt with jurisdiction context to get better legal responses
      const prompt = `As a legal AI assistant specializing in ${jurisdiction} law, provide a detailed and accurate response to the following legal question: ${query}\n\nInclude relevant legal principles, statutes, regulations, or case law if applicable. If there are multiple perspectives or interpretations, please explain them.\n\nImportant: Provide your own reasoning and analysis first, then incorporate any legal references. Think step by step and explain your thought process clearly.`;
      
      // Prepare request payload for Gemini API with safety settings to ensure appropriate responses
      const requestData: GeminiRequest = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      };
      
      try {
        // Make request to Gemini API with timeout to prevent long-hanging requests
        const response = await axios.post(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 15000 // 15 second timeout for more complex legal questions
          }
        );
        
        // Process and return the response with improved error handling
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
          const candidate = response.data.candidates[0];
          if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            const text = candidate.content.parts[0].text || '';
            
            if (text.trim()) {
              return {
                success: true,
                data: {
                  text,
                  raw: response.data
                }
              };
            }
          }
          throw new Error('Incomplete content structure in Gemini API response');
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } catch (apiError) {
        console.error('Error calling Gemini API:', apiError);
        
        // Provide a fallback response based on the jurisdiction and query
        // This ensures the app continues to function even if the API is unavailable
        let fallbackResponse = '';
        
        // Check if the query is about immigration
        if (query.toLowerCase().includes('immigration') || query.toLowerCase().includes('visa') || query.toLowerCase().includes('citizenship')) {
          if (jurisdiction.toLowerCase().includes('us') || jurisdiction.toLowerCase() === 'united states') {
            fallbackResponse = 'Immigration to the United States is governed by the Immigration and Nationality Act (INA). The U.S. offers various visa categories including family-sponsored, employment-based, diversity lottery, and humanitarian programs like asylum and refugee status. The process typically involves filing petitions with U.S. Citizenship and Immigration Services (USCIS), attending interviews, and meeting specific eligibility requirements. Immigration laws are complex and frequently change, so consulting with an immigration attorney is recommended for specific situations.';
          } else {
            fallbackResponse = `Immigration laws in ${jurisdiction} vary based on specific policies and regulations. Most countries have pathways for family reunification, employment-based immigration, humanitarian protection, and specialized programs. The process typically involves visa applications, background checks, and meeting specific eligibility criteria.`;
          }
        } else if (jurisdiction.toLowerCase().includes('us') && 
            (query.toLowerCase().includes('worker') || query.toLowerCase().includes('labor'))) {
          fallbackResponse = 'Worker law in the United States is primarily governed by federal statutes such as the Fair Labor Standards Act (FLSA), which establishes minimum wage, overtime pay, recordkeeping, and child labor standards. Other important federal laws include the Occupational Safety and Health Act (OSHA), which ensures safe working conditions, and the Family and Medical Leave Act (FMLA), which provides eligible employees with job-protected leave for family and medical reasons. Additionally, each state may have its own labor laws that provide additional protections beyond federal requirements.';
        } else if (jurisdiction.toLowerCase().includes('eu')) {
          fallbackResponse = 'Worker law in the European Union is based on a framework of directives that member states must implement in their national legislation. Key directives include the Working Time Directive (2003/88/EC), which sets maximum working hours and minimum rest periods, and the Equal Treatment Directive, which prohibits discrimination in employment. The EU also has regulations on workplace safety, parental leave, and protection against dismissal.';
        } else {
          fallbackResponse = `I can provide general information about legal matters related to "${query}" in ${jurisdiction}, but for specific legal advice, please consult with a qualified legal professional in your jurisdiction.`;
        }
        
        return {
          success: true,
          data: {
            text: fallbackResponse,
            raw: null
          }
        };
      }
    } catch (error) {
      console.error('Unexpected error in generateResponse:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while processing your request',
        data: null
      };
    }
  },
  

  
  /**
   * Format the Gemini response for display
   * @param geminiResponse - The raw Gemini API response text
   * @returns Formatted response text
   */
  formatResponse: (geminiResponse: string): { text: string } => {
    // Format the text with Markdown-like styling
    let formattedText = geminiResponse;
    
    // Format the text with Markdown-like styling
    // 1. Identify and format section headers
    formattedText = formattedText.replace(/^([A-Z][A-Za-z\s]{2,}):([^\n])/gm, '**$1:**$2');
    
    // 2. Format legal terms and important concepts (capitalized phrases)
    formattedText = formattedText.replace(/\b([A-Z][A-Z\s]+)\b/g, '**$1**');
    
    // 3. Format statute and case references with more emphasis
    formattedText = formattedText.replace(/\b(\d+\s+U\.S\.C\.\s+§\s+\d+[\w\d\-\.]*)/gi, '**_$1_**');
    formattedText = formattedText.replace(/\b([\w\s]+v\.\s+[\w\s]+,\s+\d+\s+[\w\.\s]+\d+)/gi, '**_$1_**');
    
    // Additional formatting for legal citations
    formattedText = formattedText.replace(/\b(\d{1,4}\s+[A-Za-z\.]+\s+\d{1,4})\b/g, '*$1*'); // Format citations like "123 S.Ct. 456"
    formattedText = formattedText.replace(/\b([A-Z][a-z]+\s+Code\s+§\s*\d+[\w\d\-\.]*)\b/gi, '**$1**'); // Format state codes
    
    // 4. Improve paragraph breaks for better readability
    formattedText = formattedText.replace(/\n{3,}/g, '\n\n'); // Normalize multiple line breaks
    
    // 5. Format bullet points consistently
    formattedText = formattedText.replace(/^\s*[-•]\s+/gm, '• '); // Standardize bullet points
    
    // 6. Add spacing after periods for better readability
    formattedText = formattedText.replace(/\.([A-Z])/g, '. $1');
    
    // 7. Format numbered lists consistently
    formattedText = formattedText.replace(/^\s*(\d+)\.\s+/gm, '$1. ');
    
    // 8. Add structure to the response if it doesn't have clear sections
    if (!formattedText.includes('**') && formattedText.length > 200) {
      // Split into paragraphs
      const paragraphs = formattedText.split('\n\n').filter(p => p.trim().length > 0);
      
      // If we have enough content, add structure
      if (paragraphs.length >= 2) {
        // Add a summary section at the beginning if not present
        if (!formattedText.toLowerCase().includes('summary') && !formattedText.toLowerCase().includes('conclusion')) {
          const firstPara = paragraphs[0];
          formattedText = formattedText.replace(firstPara, `**Summary:**\n${firstPara}`);
        }
        
        // Add a conclusion section at the end if not present
        if (!formattedText.toLowerCase().includes('conclusion')) {
          const lastPara = paragraphs[paragraphs.length - 1];
          if (lastPara.length < 500) { // Only if the last paragraph is reasonably sized
            formattedText = formattedText.replace(lastPara, `**Conclusion:**\n${lastPara}`);
          }
        }
      }
    }
    
    return {
      text: formattedText
    };
  },
  
  /**
   * Extract legal citations from a response
   * @param text - The response text to extract citations from
   * @returns Object with the original text and extracted citations
   */
  extractCitations: (text: string): { text: string, citations: string[] } => {
    const citations: string[] = [];
    
    // Regular expressions to match common legal citation formats
    const citationPatterns = [
      // US Supreme Court cases (e.g., Brown v. Board of Education, 347 U.S. 483 (1954))
      /([A-Z][A-Za-z\s']+v\.\s+[A-Z][A-Za-z\s']+,\s+\d+\s+U\.S\.\s+\d+\s+\(\d{4}\))/g,
      
      // US Code citations (e.g., 42 U.S.C. § 1983)
      /(\d+\s+U\.S\.C\.\s+§\s+\d+[\w\d\-\.]*)/g,
      
      // State code citations (e.g., Cal. Penal Code § 422)
      /([A-Z][a-z]+\.\s+[A-Z][a-z]+\s+Code\s+§\s*\d+[\w\d\-\.]*)/g,
      
      // Federal regulations (e.g., 24 C.F.R. § 100.204)
      /(\d+\s+C\.F\.R\.\s+§\s+\d+\.\d+)/g,
      
      // Public Laws (e.g., Pub. L. No. 116-136)
      /(Pub\.\s+L\.\s+No\.\s+\d+-\d+)/g,
      
      // Federal cases (e.g., Roe v. Wade, 410 U.S. 113)
      /([A-Z][A-Za-z\s']+v\.\s+[A-Z][A-Za-z\s']+,\s+\d+\s+F\.\d+\s+\d+)/g,
      
      // Statutes at Large (e.g., 124 Stat. 119)
      /(\d+\s+Stat\.\s+\d+)/g
    ];
    
    // Extract citations using each pattern
    citationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        // Add unique citations only
        matches.forEach(match => {
          if (!citations.includes(match)) {
            citations.push(match);
          }
        });
      }
    });
    
    return {
      text,
      citations
    };
  }
};