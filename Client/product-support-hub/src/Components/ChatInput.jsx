import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import FileUploadArea from './FileUploadArea';

function ChatInput({ onSendMessage, theme, isLoading = false }) {
  const [newMessage, setNewMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading || (!newMessage.trim() && !processingResult)) return;

    if (processingResult) {
      onSendMessage && onSendMessage(
        newMessage || 'Image analysis request', 
        processingResult.file
      );
      setProcessingResult(null);
    } else if (newMessage.trim()) {
      onSendMessage && onSendMessage(newMessage);
    }

    setNewMessage('');
    setShowFileUpload(false);
  };

  const handleProcessingComplete = (result, file) => {
    setProcessingResult({
      result: result,
      file: file,
      fileUrl: URL.createObjectURL(file),
    });
  };

  const handleFileRemoved = () => {
    setProcessingResult(null);
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  const inputStyle = {
    borderColor: theme.colors.mediumGray,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.normal,
  };

  const buttonStyle = {
    backgroundColor: isLoading 
      ? theme.colors.mediumGray 
      : theme.components.button.primary.backgroundColor,
    color: theme.components.button.primary.color,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.normal,
    opacity: isLoading ? 0.6 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
  };

  const iconButtonStyle = {
    backgroundColor: theme.colors.lightGray || '#F3F4F6',
    color: theme.colors.darkGray || '#4B5563',
  };

  return (
    <div className="chat-input-container">
      {showFileUpload && (
        <div className="file-upload-wrapper px-4">
          <FileUploadArea
            onProcessingComplete={handleProcessingComplete}
            onFileRemoved={handleFileRemoved}
            theme={theme}
            acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
            maxSize={5 * 1024 * 1024}
          />
        </div>
      )}

      {processingResult && (
        <div className="processing-result px-4 py-2 bg-blue-50 border-t">
          <div className="flex items-center space-x-2">
            <img 
              src={processingResult.fileUrl} 
              alt="Upload preview" 
              className="w-8 h-8 rounded object-cover"
            />
            <span className="text-sm text-blue-700">
              Image ready for analysis
            </span>
            <button 
              onClick={handleFileRemoved}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="chat-input p-4 border-t"
        style={{ borderColor: theme.colors.mediumGray }}
      >
        <div className="flex items-center space-x-2">
          <motion.button
            type="button"
            className="p-2 rounded-full"
            style={iconButtonStyle}
            onClick={toggleFileUpload}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
            aria-label={showFileUpload ? 'Hide file upload' : 'Show file upload'}
          >
            <PaperClipIcon className="w-5 h-5" />
          </motion.button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isLoading 
                ? 'AI is analyzing...'
                : processingResult
                ? 'Add a message about this image...'
                : 'Type your message...'
            }
            className="flex-grow p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={inputStyle}
            disabled={isLoading}
            aria-label="Message input"
          />

          <motion.button
            type="submit"
            className="px-4 py-2 rounded-lg min-w-[60px]"
            style={buttonStyle}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            disabled={isLoading || (!newMessage.trim() && !processingResult)}
            aria-label="Send message"
          >
            {isLoading ? '...' : 'Send'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;