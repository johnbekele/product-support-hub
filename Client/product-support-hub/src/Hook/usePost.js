import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useMemo } from 'react';

// Get the auth token (if needed, add it to headers in axios calls)
const getToken = () => localStorage.getItem('token');

const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/post/bug`);
  return response.data;
};

const fetchuser = async (userId) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export function usePost() {
  const PostQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 300000, // 5 minutes
  });

  const post = PostQuery.data;

  // Defensive: check if post.data is array, or post is array directly
  // Adjust depending on your API response shape
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
    isLoading: PostQuery.isLoading,
    isError: PostQuery.isError,
    error: PostQuery.error,
  };
}
