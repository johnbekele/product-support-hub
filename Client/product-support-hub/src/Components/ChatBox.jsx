import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useAiChat } from '../Hook/useAiChat.js';

function ChatBox({ isOpen, onClose, theme }) {
  const chatBoxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const { 
    messages, 
    isLoading, 
    sendMessage, 
    closeChat 
  } = useAiChat();

  const MIN_WIDTH = 300;
  const MAX_WIDTH = 600;
  const [chatWidth, setChatWidth] = useState(384);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target) &&
        isOpen &&
        !isDragging
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isDragging]);

  const handleClose = () => {
    closeChat();
    onClose();
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  const handleSendMessage = (messageText, file = null) => {
    sendMessage(messageText, file);
  };

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

          <ChatHeader onClose={handleClose} theme={theme} />
          <ChatMessages 
            messages={messages} 
            theme={theme} 
            handlefoundid={(bugId) => console.log('Bug selected:', bugId)}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            theme={theme}
            isLoading={isLoading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;