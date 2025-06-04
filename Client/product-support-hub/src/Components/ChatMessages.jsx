// ChatMessages.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

function ChatMessages({ messages, theme }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Renders a file attachment based on file type
   * @param {Object} file - File object with type, name, and url
   */
  const renderFileAttachment = (file) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="file-attachment image-attachment mb-1">
          <img
            src={file.url}
            alt={file.name}
            className="max-h-48 rounded-lg object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="file-attachment document-attachment mb-1 p-2 bg-gray-100 rounded-lg flex items-center">
          <DocumentIcon className="w-6 h-6 text-gray-500 mr-2" />
          <div className="file-info">
            <div className="file-name text-sm font-medium truncate max-w-[200px]">
              {file.name}
            </div>
            <div className="file-size text-xs text-gray-500">
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>
      );
    }
  };

  /**
   * Renders bug information from AI processing
   * @param {Object} bugInfo - Bug information from AI
   *
   *
   */

  const renderBugInfo = (bugInfo) => {
    console.log('Rendering bug info:', bugInfo);
    // Handle the case where we have raw text instead of JSON
    if (bugInfo.rawText) {
      return (
        <div className="bug-info p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2 text-sm">
          <p className="font-medium mb-1">AI Analysis:</p>
          <p className="whitespace-pre-wrap">{bugInfo.aiResponse}</p>
        </div>
      );
    }

    // If we have an array of bugs, render them
    const bugs = bugInfo.aiResponse
      ? Array.isArray(bugInfo.aiResponse)
        ? bugInfo.aiResponse
        : [bugInfo.aiResponse]
      : Array.isArray(bugInfo)
      ? bugInfo
      : [bugInfo];

    return (
      <div className="bug-info p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
        {bugs.map((bug, index) => (
          <div key={index} className="bug-item mb-3 last:mb-0">
            <p className="font-medium text-sm">{bug.title || 'Bug Details'}</p>

            <div className="bug-details text-xs space-y-1 mt-1">
              {bug.id && (
                <div className="flex">
                  <span className="font-medium w-24">ID:</span>
                  <span>{bug.id}</span>
                </div>
              )}

              {bug.product && (
                <div className="flex">
                  <span className="font-medium w-24">Product:</span>
                  <span>{bug.product}</span>
                </div>
              )}

              {bug.type && (
                <div className="flex">
                  <span className="font-medium w-24">Type:</span>
                  <span>{bug.type}</span>
                </div>
              )}

              {bug.status && (
                <div className="flex">
                  <span className="font-medium w-24">Status:</span>
                  <span>{bug.status}</span>
                </div>
              )}

              {bug.resolution && (
                <div className="flex">
                  <span className="font-medium w-24">Resolution:</span>
                  <span>{bug.resolution}</span>
                </div>
              )}

              {bug.description && (
                <div className="mt-2">
                  <span className="font-medium block">Description:</span>
                  <p className="mt-1 whitespace-pre-wrap">{bug.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Formats file size to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="chat-messages flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
            style={{ fontFamily: theme.typography.fontFamily }}
          >
            {/* Render file attachment if present */}
            {msg.file && renderFileAttachment(msg.file)}

            {/* Render message text */}
            {msg.text && <div>{msg.text}</div>}

            {/* Render bug info if present */}
            {msg.bugInfo && renderBugInfo(msg.bugInfo)}
          </div>
        </motion.div>
      ))}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
