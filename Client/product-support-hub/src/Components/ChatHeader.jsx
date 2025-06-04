// ChatHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * ChatHeader Component
 *
 * The header section of the chat box with title and close button
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when closing the chat
 * @param {Object} props.theme - Theme object for styling
 */
function ChatHeader({ onClose, theme }) {
  return (
    <div
      className="chat-header flex justify-between items-center p-4 border-b"
      style={{ borderColor: theme.colors.mediumGray }}
    >
      <h3
        className="font-semibold text-lg"
        style={{ fontFamily: theme.typography.fontFamily }}
      >
        Product Support Chat
      </h3>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-1 rounded-full hover:bg-gray-100"
        aria-label="Close chat"
      >
        <XMarkIcon className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

export default ChatHeader;
