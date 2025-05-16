import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import AuthContext from '../Context/AuthContext';

const getToken = () => localStorage.getItem('token');

const fetchChats = async () => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const startChat = async (receiverId) => {
  const response = await axios.post(
    `${API_URL}/chat/start`,
    { receiverId },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

// In useChat.js
export function useChat() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const chatQuery = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 5 * 60 * 1000,
  });

  // Query for fetching all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  const users = usersQuery.data || [];

  // Safely process chats data with null checks
  const chats = chatQuery.data
    ?.map((chat) => {
      if (!chat || !Array.isArray(chat.participants)) {
        return null;
      }

      const participants = chat.participants
        .filter((participant) => participant && participant._id !== user?.id)
        .map((participant) => {
          const userData = users.find((u) => u && u._id === participant._id);
          return {
            _id: participant._id,
            username: userData
              ? `${userData.firstname} ${userData.lastname}`
              : 'Unknown User',
            email: userData?.email || '',
            photo: userData?.photo || 'no photo',
          };
        });

      // Safely handle lastMessage which might be undefined
      const lastMessageContent = chat.lastMessage?.content || '';

      return {
        _id: chat._id,
        username: participants[0]?.username || 'Unknown',
        lastMessage: lastMessageContent,
        avatar: participants[0]?.photo || '',
        updatedAt: new Date(),
      };
    })
    .filter(Boolean); // Filter out any null values

  const startChatMutation = useMutation({
    mutationFn: startChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['chats']);
      return data; // Return the data for further processing
    },
  });

  return {
    chats: chats || [], // Ensure chats is always an array
    isLoading: chatQuery.isLoading,
    createNewChat: startChatMutation.mutateAsync, // Use mutateAsync to get the promise
    isError: chatQuery.isError,
    error: chatQuery.error,
  };
}
