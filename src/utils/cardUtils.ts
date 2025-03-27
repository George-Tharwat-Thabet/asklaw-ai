import { Message } from '../store/slices/chatSlice';

/**
 * Extract important points from an AI response message
 * @param message - The AI message to extract points from
 * @param maxPoints - Maximum number of points to extract (default: 3)
 * @returns Array of important points
 */
export const extractImportantPoints = (message: Message, maxPoints: number = 3): string[] => {
  if (message.sender !== 'ai' || !message.text) {
    return [];
  }
  
  const text = message.text;
  const points: string[] = [];
  
  // Strategy 1: Look for sections with headers (e.g., "Summary:", "Conclusion:")
  const headerMatches = text.match(/\*\*([^:]+):\*\*([^\*]+)/g);
  if (headerMatches && headerMatches.length > 0) {
    for (const match of headerMatches) {
      const cleanedText = match
        .replace(/\*\*/g, '')
        .replace(/<br\/>/g, ' ')
        .trim();
      
      // Split header and content
      const [header, ...contentParts] = cleanedText.split(':');
      const content = contentParts.join(':').trim();
      
      // Only add if content is substantial (more than just a few words)
      if (content.split(' ').length > 5) {
        // Use full content without truncation
        points.push(`${header}: ${content}`);
        
        if (points.length >= maxPoints) {
          return points;
        }
      }
    }
  }
  
  // Strategy 2: Look for bullet points
  const bulletMatches = text.match(/•\s+([^•\n]+)/g);
  if (bulletMatches && bulletMatches.length > 0) {
    for (const match of bulletMatches) {
      const cleanedText = match
        .replace(/•\s+/, '')
        .replace(/<br\/>/g, ' ')
        .trim();
      
      // Only add if content is substantial
      if (cleanedText.split(' ').length > 5) {
        // Use full content without truncation
        points.push(cleanedText);
        
        if (points.length >= maxPoints) {
          return points;
        }
      }
    }
  }
  
  // Strategy 3: Look for numbered points
  const numberedMatches = text.match(/(\d+)\.\s+([^\d\.\n]+)/g);
  if (numberedMatches && numberedMatches.length > 0) {
    for (const match of numberedMatches) {
      const cleanedText = match
        .replace(/\d+\.\s+/, '')
        .replace(/<br\/>/g, ' ')
        .trim();
      
      // Only add if content is substantial
      if (cleanedText.split(' ').length > 5) {
        // Use full content without truncation
        points.push(cleanedText);
        
        if (points.length >= maxPoints) {
          return points;
        }
      }
    }
  }
  
  // Strategy 4: If we still don't have enough points, extract sentences with legal terms
  if (points.length < maxPoints) {
    const legalTerms = [
      'law', 'legal', 'statute', 'regulation', 'court', 'rights', 
      'obligation', 'liability', 'contract', 'jurisdiction', 'plaintiff',
      'defendant', 'attorney', 'judge', 'verdict', 'ruling'
    ];
    
    // Split text into sentences
    const sentences = text.split(/\.\s+/);
    
    for (const sentence of sentences) {
      // Check if sentence contains legal terms
      const containsLegalTerm = legalTerms.some(term => 
        sentence.toLowerCase().includes(term)
      );
      
      if (containsLegalTerm && sentence.split(' ').length > 5) {
        const cleanedText = sentence
          .replace(/<br\/>/g, ' ')
          .replace(/\*\*/g, '')
          .trim();
        
        // Use full content without truncation
        
        // Avoid duplicates
        if (!points.some(p => p.includes(cleanedText))) {
          points.push(cleanedText);
        }
        
        if (points.length >= maxPoints) {
          return points;
        }
      }
    }
  }
  
  // Strategy 5: If we still don't have enough points, just take the first few paragraphs
  if (points.length < maxPoints) {
    const paragraphs = text.split(/\n\n/);
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim().length > 0 && paragraph.split(' ').length > 10) {
        const cleanedText = paragraph
          .replace(/<br\/>/g, ' ')
          .replace(/\*\*/g, '')
          .trim();
        
        // Use full content without truncation
        
        // Avoid duplicates
        if (!points.some(p => p.includes(cleanedText))) {
          points.push(cleanedText);
        }
        
        if (points.length >= maxPoints) {
          return points;
        }
      }
    }
  }
  
  return points;
};

/**
 * Get important points from the most recent AI message in a conversation
 * @param messages - Array of messages in the conversation
 * @param maxPoints - Maximum number of points to extract
 * @returns Array of important points
 */
export const getImportantPointsFromLatestAIMessage = (
  messages: Message[],
  maxPoints: number = 3
): string[] => {
  // Find the most recent AI message
  const aiMessages = messages.filter(msg => msg.sender === 'ai');
  
  if (aiMessages.length === 0) {
    return [];
  }
  
  const latestAIMessage = aiMessages[aiMessages.length - 1];
  return extractImportantPoints(latestAIMessage, maxPoints);
};