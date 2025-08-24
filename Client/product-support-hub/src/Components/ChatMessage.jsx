import React from 'react';
import { motion } from 'framer-motion';
import FileAttachment from './FileAttachment';
import BugInfo from './BugInfo';

const ChatMessage = ({ message, theme, onBugClick, isNew = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
        style={{ fontFamily: theme.typography.fontFamily }}
      >
        {message.file && <FileAttachment file={message.file} />}
        {message.text && <div>{message.text}</div>}
        {message.bugInfo && (
          <BugInfo 
            bugInfo={message.bugInfo} 
            onBugClick={onBugClick} 
            isNew={isNew}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;