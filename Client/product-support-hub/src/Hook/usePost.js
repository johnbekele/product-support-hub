import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useMemo } from 'react';

const getToken = () => localStorage.getItem('token');

const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/post/bug`);
  return response.data.reverse();
};

const createPost = async (postData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/post/createpost`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deletePost = async (postId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/post/deletepost/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const postSuggestedResolutions = async (postId, resolutions) => {
  const token = getToken();
  const response = await axios.post(
    `${API_URL}/post/suggestedresolutions/${postId}`,
    { suggestedResolutions: resolutions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export function usePost() {
  const queryClient = useQueryClient();

  const PostQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 300000,
  });

  const creatPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const postResolutionMutation = useMutation({
    mutationFn: postSuggestedResolutions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const post = PostQuery.data;

  const postdata = useMemo(() => {
    if (!post) return [];
    const dataArray = Array.isArray(post) ? post : post.data;
    if (!Array.isArray(dataArray)) return [];

    return dataArray.map((post) => ({
      id: post._id,
      description: post.description,
      title: post.title,
      product: post.product,
      type: post.type,
      severity: post.severity,
      status: post.status,
      createdAt: post.createdAt,
      createdBy: post.createdBy,
      resolution: post.resolution,
      comments: post.comment || [],
      suggestedResolutions: post.suggestedResolutions || [],
    }));
  }, [post]);

  return {
    postdata,
    createPostMutation: creatPostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isLoading: PostQuery.isLoading,
    isError: PostQuery.isError,
    error: PostQuery.error,
  };
}
