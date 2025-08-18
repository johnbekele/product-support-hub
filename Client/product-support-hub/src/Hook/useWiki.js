import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useMemo } from 'react';

const getToken = () => localStorage.getItem('token');

const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/wiki/wikiTable`);
  return response.data.reverse();
};



export function useWiki() {
  const queryClient = useQueryClient();

  const WikiQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 300000,
  });

const  wikiData= WikiQuery.data;
  

  return {
    wikiData,
    isLoading: WikiQuery.isLoading,
    isError: WikiQuery.isError,
    error: WikiQuery.error,
  };
}
