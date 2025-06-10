// ChatBox.jsx - A resizable chat interface component with messaging functionality
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function ChatBox({ isOpen, onClose, theme }) {
  const chatBoxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Chat configuration
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 600;
  const [chatWidth, setChatWidth] = useState(384);

  // Chat messages state
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: 2, text: 'Welcome to Product Support Hub', sender: 'bot' },
  ]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target) &&
        isOpen &&
        !isDragging
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isDragging]);

  // Handle resize drag events
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  // Send a text message
  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      // Add user message
      setMessages([
        ...messages,
        { id: Date.now(), text: messageText, sender: 'user' },
      ]);

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: 'Thanks for your message! Our support team will get back to you soon.',
            sender: 'bot',
          },
        ]);
      }, 1000);
    }
  };

  // Send a file with AI processing results
  const handleSendProcessedFile = (processingData, caption = '') => {
    // Add user message with file
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: caption,
        sender: 'user',
        file: {
          name: processingData.file.name,
          type: processingData.file.type,
          size: processingData.file.size,
          url: processingData.fileUrl,
        },
        aiProcessed: true,
      },
    ]);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I've analyzed your screenshot and found the following bug information:",
          sender: 'bot',
          bugInfo: processingData.result,
        },
      ]);
    }, 1000);
  };

  // Theme-based styling
  const chatBoxStyle = {
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
    borderLeft: `1px solid ${theme.colors.mediumGray}`,
    width: `${chatWidth}px`,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatBoxRef}
          className="fixed top-16 right-0 h-[calc(100vh-64px)] z-50 flex flex-col"
          style={chatBoxStyle}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 1,
            bounce: 0.25,
          }}
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 hover:opacity-50 z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              handleDragStart();

              const onMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - e.clientX;
                const newWidth = chatWidth - deltaX;

                if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                  setChatWidth(newWidth);
                }
              };

              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                handleDragEnd();
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />

          <ChatHeader onClose={onClose} theme={theme} />
          <ChatMessages messages={messages} theme={theme} />
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendFile={handleSendProcessedFile}
            theme={theme}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
