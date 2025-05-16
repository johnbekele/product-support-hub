import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useId } from 'react';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchUserInfo = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const escalateuser = async ({ userId, torole }) => {
  const response = await axios.post(
    `${API_URL}/auth/escalate/${userId}`,
    { torole },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  console.log('Escalation response:', response.data);
  return response.data;
};

const deletefn = async (userId) => {
  const response = await axios.delete(`${API_URL}/auth/delete/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const freezuser = async (userId) => {
  const response = await axios.put(
    `${API_URL}/auth/freez/access/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

const restoreuser = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/restore/access/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Custom hook for books
export function useUser() {
  const queryClient = useQueryClient();

  const userInfoQuery = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
  });

  const escalateMutation = useMutation({
    mutationFn: escalateuser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletefn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  const freezMutation = useMutation({
    mutationFn: freezuser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreuser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  userInfoQuery.data || [];
  return {
    user: userInfoQuery.data || [],
    escalate: escalateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    freezUser: freezMutation.mutate,
    restoreUser: restoreMutation.mutate,
    isLoading: userInfoQuery.isLoading,
    isError: userInfoQuery.isError,
    error: userInfoQuery.error,
  };
}
