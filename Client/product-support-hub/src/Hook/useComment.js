import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

const getToken = () => localStorage.getItem('token');

// ✅ Accepts one object with postId and content
const createComment = async ({ postId, content }) => {
  const response = await axios.post(
    `${API_URL}/comment/${postId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await axios.delete(`${API_URL}/comment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export function useComment() {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
    },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
    },
  });

  return {
    createComment: createCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isLoading: createCommentMutation.isLoading,
    isError: createCommentMutation.isError,
    error: createCommentMutation.error,
  };
}
