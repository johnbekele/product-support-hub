// ChatInput.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperClipIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import FileUploadArea from './FileUploadArea';

function ChatInput({ onSendMessage, onSendFile, theme }) {
  const [newMessage, setNewMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (processingResult) {
      // Send the AI processing result along with any message
      onSendFile && onSendFile(processingResult, newMessage);
      setProcessingResult(null);
    } else if (newMessage.trim()) {
      onSendMessage && onSendMessage(newMessage);
    }

    setNewMessage('');
    setShowFileUpload(false);
  };

  /**
   * Handles when AI processing is complete
   * @param {Object} result - The AI processing result
   * @param {File} file - The original file
   */
  const handleProcessingComplete = (result, file) => {
    // Store the result to be sent when the user submits
    setProcessingResult({
      result: result,
      file: file,
      fileUrl: URL.createObjectURL(file),
    });
  };

  /**
   * Handles file removal
   */
  const handleFileRemoved = () => {
    setProcessingResult(null);
  };

  /**
   * Toggles file upload area visibility
   */
  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  // Styling based on theme
  const inputStyle = {
    borderColor: theme.colors.mediumGray,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.normal,
  };

  const buttonStyle = {
    backgroundColor: theme.components.button.primary.backgroundColor,
    color: theme.components.button.primary.color,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.normal,
  };

  const iconButtonStyle = {
    backgroundColor: theme.colors.lightGray || '#F3F4F6',
    color: theme.colors.darkGray || '#4B5563',
  };

  return (
    <div className="chat-input-container">
      {/* File Upload Area */}
      {showFileUpload && (
        <div className="file-upload-wrapper px-4">
          <FileUploadArea
            onProcessingComplete={handleProcessingComplete}
            onFileRemoved={handleFileRemoved}
            theme={theme}
            acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className="chat-input p-4 border-t"
        style={{ borderColor: theme.colors.mediumGray }}
      >
        <div className="flex items-center space-x-2">
          {/* File Upload Toggle Button */}
          <motion.button
            type="button"
            className="p-2 rounded-full"
            style={iconButtonStyle}
            onClick={toggleFileUpload}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={
              showFileUpload ? 'Hide file upload' : 'Show file upload'
            }
          >
            <PaperClipIcon className="w-5 h-5" />
          </motion.button>

          {/* Text Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              processingResult
                ? 'Add a message about this image...'
                : 'Type your message...'
            }
            className="flex-grow p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={inputStyle}
            aria-label="Message input"
          />

          {/* Send Button */}
          <motion.button
            type="submit"
            className="px-4 py-2 rounded-lg"
            style={buttonStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!newMessage.trim() && !processingResult}
            aria-label="Send message"
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
