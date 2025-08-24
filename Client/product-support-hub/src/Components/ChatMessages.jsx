import React, { useRef, useEffect, useState } from 'react';
import { useBugContext } from '../Context/BugContext';
import ChatMessage from './ChatMessage';

function ChatMessages({ messages = [], theme, handlefoundid }) {
  const messagesEndRef = useRef(null);
  const [currentBugInfo, setCurrentBugInfo] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const { setSelectedBugId } = useBugContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.bugInfo) {
      setCurrentBugInfo(latestMessage.bugInfo);
    }

    // Track the latest message ID
    if (latestMessage?.id) {
      setLastMessageId(latestMessage.id);
    }
  }, [messages]);

  useEffect(() => {
    if (!currentBugInfo || currentBugInfo.rawText) return;

    const extractBugs = (bugInfo) => {
      if (bugInfo.aiResponse) {
        return Array.isArray(bugInfo.aiResponse) ? bugInfo.aiResponse : [bugInfo.aiResponse];
      }
      return Array.isArray(bugInfo) ? bugInfo : [bugInfo];
    };

    const bugs = extractBugs(currentBugInfo);
    const firstBug = bugs[0];
    
    if (firstBug?.id) {
      setSelectedBugId(firstBug.id);
      handlefoundid?.(firstBug.id);
    }
  }, [currentBugInfo, handlefoundid, setSelectedBugId]);

  const handleBugClick = (bugId) => {
    setSelectedBugId(bugId);
    handlefoundid?.(bugId);
  };

  if (!messages || !Array.isArray(messages)) {
    return <div className="chat-messages flex-grow p-4">No messages</div>;
  }

  return (
    <div className="chat-messages flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          theme={theme}
          onBugClick={handleBugClick}
          isNew={msg.id === lastMessageId && msg.sender === 'bot' && msg.bugInfo}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;