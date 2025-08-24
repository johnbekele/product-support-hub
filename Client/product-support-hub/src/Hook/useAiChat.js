import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { toast } from 'react-hot-toast';

const getToken = () => localStorage.getItem('token');

const queryAi = async ({ text, conversationHistory }) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_URL}/post/ai/querybug`,
      { 
        text,
        conversationHistory 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('AI Query Error:', err);
    throw err;
  }
};

export function useAiChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: 2, text: 'Welcome to Product Support Hub', sender: 'bot' },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const queryMutation = useMutation({
    mutationFn: queryAi,
    onSuccess: (data, variables) => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Here are the relevant solutions:',
        bugInfo: data,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      toast.error('Failed to get AI response');
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  // Format conversation history for AI context
  const formatConversationHistory = useCallback((messages) => {
    return messages
      .filter(msg => msg.sender === 'user' || (msg.sender === 'bot' && msg.bugInfo))
      .slice(-10) // Keep last 10 relevant messages to avoid token limits
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.sender === 'user' 
          ? msg.text 
          : typeof msg.bugInfo === 'string' 
            ? msg.bugInfo 
            : msg.bugInfo?.rawText || msg.text
      }));
  }, []);

  const sendMessage = useCallback((text, file = null) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      } : null,
      timestamp: new Date(),
    };
    
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      
      // Get conversation history and send to AI
      const conversationHistory = formatConversationHistory(updatedMessages);
      queryMutation.mutate({ text, conversationHistory });
      
      return updatedMessages;
    });
  }, [queryMutation, formatConversationHistory]);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setMessages([
      { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
      { id: 2, text: 'Welcome to Product Support Hub', sender: 'bot' },
    ]);
  }, []);

  return {
    messages,
    isOpen,
    isLoading: queryMutation.isPending,
    sendMessage,
    openChat,
    closeChat,
  };
}