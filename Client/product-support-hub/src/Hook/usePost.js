import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

// Get API functions
const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data.reverse();
};

const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const deletePostfn = async (commentID) => {
  const response = await axios.delete(
    `${API_URL}/posts/delete/mycomment/${commentID}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};
// //Post API functions
// const addPost = async (post) => {
//   const response = await axios.post(`${API_URL}/posts/add`, post, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return response.data;
// };

// Add like/unlike function
const likePost = async ({ postId, isLiked }) => {
  const endpoint = isLiked ? 'unlike' : 'like';
  const response = await axios.post(
    `${API_URL}/posts/${postId}/${endpoint}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

//Add comment function
const addComment = async (postId, commentText) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/comment/${postId}`,
      { commentText },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    // logger.log('Comment response:', response.data.moderation[0]);

    // Check if response contains flagged content
    if (response.data.moderation && response.data.moderation[0] === 'Flagged') {
      return {
        success: false,
        flagged: true,
        reason: response.data.moderation[2] || 'Content policy violation',
        comment: commentText,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Comment error:', error);
    throw error;
  }
};

// Custom hook for posts with user data
export function usePost() {
  const queryClient = useQueryClient();

  // Query for fetching all posts
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Query for fetching all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
  });

  // Mutation for liking/unliking a post
  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Mutation for adding a comment
  const commentMutation = useMutation({
    mutationFn: ({ postId, commentText }) => {
      return addComment(postId, commentText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Mutation for deleting a post
  const deleteMutation = useMutation({
    mutationFn: (commentID) => {
      return deletePostfn(commentID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Create a user lookup map for quick access
  const userMap = {};
  if (usersQuery.data) {
    usersQuery.data.forEach((user) => {
      userMap[user._id] = user;
    });
  }

  // Combine post data with user data
  const posts = postsQuery.data || [];
  const postsWithUsers = posts.map((post) => {
    // Get user data for the post creator
    const userData = userMap[post.user] || null;

    // Enhance comments with user data
    const enhancedComments =
      post.comment?.map((comment) => ({
        ...comment,
        userData: userMap[comment.user] || null,
      })) || [];

    return {
      ...post,
      userData,
      comment: enhancedComments,
    };
  });

  return {
    posts: postsWithUsers,
    rawPosts: posts,
    users: userMap,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    isError: postsQuery.isError || usersQuery.isError,
    error: postsQuery.error || usersQuery.error,

    // Like mutation
    likePost: likeMutation.mutate,
    likePostLoading: likeMutation.isPending,

    // Comment mutation
    addComment: async (postId, commentText) => {
      try {
        const result = await commentMutation.mutateAsync({
          postId,
          commentText,
        });
        return result; // This will now properly return the object with success property
      } catch (error) {
        console.error('Error adding comment:', error);
        return {
          success: false,
          error: error.message,
        };
      }
    },
    addCommentLoading: commentMutation.isPending,
    deletePost: deleteMutation.mutate,
  };
}
