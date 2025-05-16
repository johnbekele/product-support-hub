import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useId } from 'react';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchFavorites = async () => {
  const response = await axios.get(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

const fetchBooks = async () => {
  const response = await axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

const addFavorites = async (postId) => {
  const response = await axios.post(
    `${API_URL}/add/${postId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

const deleteFavorites = async (favId) => {
  const response = await axios.delete(
    `${API_URL}/delete/${favId}`,
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );

  return response;
};
export function useFavorite() {
  const queryClient = useQueryClient();

  const favoriteQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  });

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  const addFavoritesMutation = useMutation({
    mutationFn: addFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  const deleteFavoritesMutation = useMutation({
    mutationFn: deleteFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  // Always include favorites array, even during loading
  const favorites = favoriteQuery.data || [];

  // Create mappedbooks regardless of loading state
  const mappedbooks = {};
  if (booksQuery.data) {
    booksQuery.data.forEach((book) => {
      mappedbooks[book._id] = book;
    });
  }

  // Create enhancedFav only if both data sources are available
  const enhancedFav = favorites
    .map((favorite) => {
      const bookdata = mappedbooks[favorite.bookid];
      return bookdata;
    })
    .filter(Boolean); // Filter out undefined values

  return {
    favorites,
    addFavorite: addFavoritesMutation.mutate,
    deleteFavorite: deleteFavoritesMutation.mutate,
    enhancedFav,
    isLoading: favoriteQuery.isLoading || booksQuery.isLoading,
    isError: favoriteQuery.isError || booksQuery.isError,
  };
}
