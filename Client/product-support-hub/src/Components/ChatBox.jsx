// ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function ChatBox({ isOpen, onClose, theme }) {
  const chatBoxRef = useRef(null);
  const dragControls = useDragControls();
  const [foundid, setFoundId] = useState();

  // State for chat width
  const [chatWidth, setChatWidth] = useState(384); // Default width (96 * 4 = 384px)
  const [isDragging, setIsDragging] = useState(false);

  // Min and max width constraints
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 600;

  // State for chat messages
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: 2, text: 'Welcome to Product Support Hub', sender: 'bot' },
  ]);

  // Handle clicks outside the chat box to close it
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isDragging]);

  // Handle drag to resize
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event, info) => {
    // Calculate new width by subtracting drag delta from current width
    const newWidth = chatWidth - info.delta.x;

    // Apply constraints
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setChatWidth(newWidth);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  /**
   * Handles sending a new text message
   * @param {string} messageText - The message text to send
   */
  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      // Add user message
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: messageText,
          sender: 'user',
        },
      ]);

      // Simulate bot response after a short delay
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

  /**
   * Handles sending a file with AI processing results
   * @param {Object} processingData - Contains the AI result and file info
   * @param {string} caption - Optional caption for the file
   */
  const handleSendProcessedFile = (processingData, caption = '') => {
    // Add user message with file and AI results
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

    // Extract bug information from AI results
    const bugInfo = processingData.result;

    // Create a response message with the AI analysis
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I've analyzed your screenshot and found the following bug information:",
          sender: 'bot',
          bugInfo: bugInfo,
        },
      ]);
    }, 1000);
  };

  // Styling based on theme
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

              // Set up drag handlers
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
