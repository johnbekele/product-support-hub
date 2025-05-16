import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

// API functions
const fetchBooks = async () => {
  const response = await axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const addBook = async (book) => {
  const response = await axios.post(`${API_URL}/books/add`, book, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Custom hook for books
export function useBooks() {
  const queryClient = useQueryClient();

  // Query for fetching all books
  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  // Mutation for adding a new book
  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: (newBook) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['books']);
    },
  });

  return {
    books: booksQuery.data || [],
    isLoading: booksQuery.isLoading,
    isError: booksQuery.isError,
    error: booksQuery.error,
    addBook: addBookMutation.mutate,
    addBookLoading: addBookMutation.isLoading,
    addBookError: addBookMutation.error,
    addBookSuccess: addBookMutation.isSuccess,
  };
}
