// ChatButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

/**
 * ChatButton Component
 *
 * Button in the navbar that toggles the chat box
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {boolean} props.isOpen - Whether the chat is currently open
 * @param {Object} props.theme - Theme object for styling
 */
function ChatButton({ onClick, isOpen, theme }) {
  return (
    <motion.button
      className="text-stone-50 flex items-center gap-1 px-3 py-2 hover:bg-opacity-20 hover:bg-white rounded-md"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.normal,
      }}
      aria-label="Toggle chat"
      aria-expanded={isOpen}
    >
      <ChatBubbleLeftRightIcon className="w-5 h-5" />
      <span className="hidden md:inline">Chat</span>
    </motion.button>
  );
}

export default ChatButton;
