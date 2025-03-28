import { Message } from '../store/slices/chatSlice';
import jsPDF from 'jspdf';

/**
 * Download the AI response as a text file
 * @param message - The message to download
 * @param format - The format to download (txt or pdf)
 */
export const downloadMessage = (message: Message, format: 'txt' | 'pdf' = 'txt'): void => {
  if (format === 'txt') {
    downloadAsTxt(message);
  } else {
    downloadAsPdf(message);
  }
};

/**
 * Download the AI response as a text file
 * @param message - The message to download
 */
const downloadAsTxt = (message: Message): void => {
  // Create a blob with the message text
  const blob = new Blob([message.text], { type: 'text/plain' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  
  // Set the filename with timestamp
  const date = new Date(message.timestamp);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  a.download = `legal-response-${formattedDate}.txt`;
  
  // Append to body, click, and remove
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Revoke the URL to free up memory
  URL.revokeObjectURL(url);
};

/**
 * Download the AI response as a PDF file
 * @param message - The message to download
 */
const downloadAsPdf = (message: Message): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set the filename with timestamp
  const date = new Date(message.timestamp);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const filename = `legal-response-${formattedDate}.pdf`;
  
  // Add a title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AskLaw AI - Legal Response', 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date(message.timestamp).toLocaleString()}`, 105, 30, { align: 'center' });
  
  // Add a divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Format the message text for PDF
  // Remove HTML tags and convert line breaks
  const formattedText = message.text
    .replace(/<br\/>/g, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '');
  
  // Add the message content
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Split text to fit within page width and handle line breaks
  let yPosition = 45;
  const pageHeight = 280;
  const lineHeight = 7;

  const splitText = doc.splitTextToSize(formattedText, 170);
  splitText.forEach((line: string) => {
    if (yPosition + lineHeight > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += lineHeight;
  });
  
  // Add a footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text('Disclaimer: AskLaw-AI provides information for educational purposes only.', 105, doc.internal.pageSize.height - 15, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(filename);
};

/**
 * Read the AI response aloud using the Web Speech API
 * @param message - The message to read aloud
 * @returns A function to stop the speech
 */
export const speakMessage = (message: Message): (() => void) => {
  // Check if the Web Speech API is supported
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech not supported in this browser');
    return () => {};
  }
  
  // Create a new SpeechSynthesisUtterance instance
  const utterance = new SpeechSynthesisUtterance(message.text);
  
  // Set properties
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
  
  // Return a function to stop speaking
  return () => {
    window.speechSynthesis.cancel();
  };
};