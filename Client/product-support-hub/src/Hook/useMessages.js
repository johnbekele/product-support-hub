import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

// Constants and helpers
const SOCKET_URL = API_URL.split('/api')[0];
const getToken = () => localStorage.getItem('token');
const getCurrentUserId = () => localStorage.getItem('userId');

// Socket singleton
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => console.log('Socket connected'));
    socketInstance.on('disconnect', () => console.log('Socket disconnected'));
    socketInstance.on('connect_error', (error) =>
      console.error('Socket connection error:', error)
    );
  }
  return socketInstance;
};

// API service
const messagesApi = {
  fetchMessages: async (chatId) => {
    if (!chatId) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  sendMessage: async ({ chatId, content }) => {
    if (!chatId || !content || content.trim() === '') {
      throw new Error('Chat ID and content are required');
    }

    const response = await axios.post(
      `${API_URL}/messages/send`,
      { chatId, content: content.trim() },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  },

  fetchUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
};

// Process messages to ensure valid structure and content
const processMessages = (messages = [], users = []) => {
  if (!Array.isArray(messages)) return [];

  const seen = new Set();
  return messages
    .filter((message) => {
      if (!message || typeof message !== 'object') return false;
      if (!message._id) return true;
      if (seen.has(message._id)) return false;
      seen.add(message._id);
      return true;
    })
    .map((message) => {
      // Ensure message content is never undefined
      const processedMessage = {
        ...message,
        content: message.content || message.objectcontent || '',
      };

      // Enhance sender info if available
      if (
        processedMessage.sender &&
        processedMessage.sender._id &&
        users.length > 0
      ) {
        const userData = users.find(
          (user) => user._id === processedMessage.sender._id
        );
        if (userData) {
          return {
            ...processedMessage,
            sender: {
              ...processedMessage.sender,
              username: `${userData.firstname} ${userData.lastname}`,
              photo: userData.photo || 'default-avatar.png',
            },
          };
        }
      }
      return processedMessage;
    });
};

export function useMessages(chatId) {
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const listenersRef = useRef({});
  const currentUserId = getCurrentUserId();
  const isPendingChat = chatId?.startsWith('pending_');

  // Fetch users for mapping
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: messagesApi.fetchUsers,
    staleTime: 300000, // 5 minutes cache
  });

  // Fetch messages
  const {
    data: rawMessages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messagesApi.fetchMessages(chatId),
    enabled: Boolean(chatId) && !isPendingChat,
    staleTime: 60000,
  });

  // Process messages
  const messages = processMessages(rawMessages, users);

  // Send message mutation
  const {
    mutate: sendMessageMutation,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
  } = useMutation({
    mutationFn: ({ content, targetChatId }) =>
      messagesApi.sendMessage({
        chatId: targetChatId || chatId,
        content,
      }),
    onSuccess: (newMessage, { targetChatId }) => {
      if (!newMessage || typeof newMessage !== 'object') return;

      // Use the target chat ID or fallback to current chatId
      const messageChatId = targetChatId || chatId;

      queryClient.setQueryData(['messages', messageChatId], (oldData = []) => {
        const processedData = processMessages(oldData, users);

        // Check if message already exists
        const exists = processedData.some((m) => m._id === newMessage._id);
        if (exists) return processedData;

        // Process the new message
        const enhancedMessage = processMessages([newMessage], users)[0];
        return [...processedData, enhancedMessage];
      });

      // Invalidate chats query to update last message
      queryClient.invalidateQueries(['chats']);
    },
  });

  // Send message handler
  const handleSendMessage = useCallback(
    async (content, overrideChatId = null) => {
      if (!content || content.trim() === '') return;

      const targetChatId = overrideChatId || chatId;
      if (!targetChatId || (isPendingChat && !overrideChatId)) return;

      return await sendMessageMutation({
        content,
        targetChatId,
      });
    },
    [chatId, isPendingChat, sendMessageMutation]
  );

  // Check if user is online
  const isUserOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers]
  );

  // Socket connection and event handling
  useEffect(() => {
    if (!chatId) return;

    const socket = getSocket();

    // Clean up existing listeners
    const cleanup = () => {
      if (listenersRef.current[chatId]) {
        const handlers = listenersRef.current[chatId];
        socket.emit('leaveRoom', chatId);
        socket.off('reciveMessage', handlers.messageHandler);
        socket.off('userOnline', handlers.onlineHandler);
        socket.off('userOffline', handlers.offlineHandler);
        socket.off('onlineUsers', handlers.usersHandler);
        delete listenersRef.current[chatId];
      }
    };

    cleanup();

    // Message handler
    const messageHandler = (message) => {
      if (!message || typeof message !== 'object' || !message.sender) {
        console.warn('Received invalid message format:', message);
        return;
      }

      // Only update if the message is from someone else
      if (message.sender._id !== currentUserId) {
        queryClient.setQueryData(['messages', chatId], (oldData = []) => {
          const processedData = processMessages(oldData, users);

          // Check if message already exists
          const exists = processedData.some((m) => m._id === message._id);
          if (exists) return processedData;

          // Process the new message
          const enhancedMessage = processMessages([message], users)[0];
          return [...processedData, enhancedMessage];
        });
      }
    };

    // User status handlers
    const onlineHandler = (userId) => {
      if (typeof userId !== 'string') return;
      setOnlineUsers((prev) => new Set([...prev, userId]));
    };

    const offlineHandler = (userId) => {
      if (typeof userId !== 'string') return;
      setOnlineUsers((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(userId);
        return newSet;
      });
    };

    const usersHandler = (users) => {
      if (!Array.isArray(users)) return;
      setOnlineUsers(new Set(users.filter((id) => typeof id === 'string')));
    };

    // Store handlers for cleanup
    listenersRef.current[chatId] = {
      messageHandler,
      onlineHandler,
      offlineHandler,
      usersHandler,
    };

    // Join room and set up listeners
    socket.emit('joinRoom', chatId);
    socket.on('reciveMessage', messageHandler);
    socket.on('userOnline', onlineHandler);
    socket.on('userOffline', offlineHandler);
    socket.on('onlineUsers', usersHandler);
    socket.emit('getOnlineUsers', chatId);

    return cleanup;
  }, [chatId, currentUserId, queryClient, users]);

  return {
    messages: messages || [],
    onlineUsers: Array.from(onlineUsers),
    isLoading,
    isError,
    error,
    isSending,
    isSendError,
    sendError,
    isPendingChat,
    sendMessage: handleSendMessage,
    refreshMessages: refetch,
    isUserOnline,
  };
}
