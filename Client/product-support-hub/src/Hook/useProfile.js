import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchProfile = async (userId) => {
  const response = await axios.post(
    `${API_URL}/auth/profile/${userId}`,
    {},
    {
      headers: `Bearer:${getToken()}`,
    }
  );
  return response.data;
};
// Custom hook for posts with user data
export function useProfile(userId) {
  const queryClient = useQueryClient();

  const useProfileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    staleTime: 5 * 60 * 100,
  });

  const profile = useProfileQuery.data;

  const profileData = {
    id: profile?._id,
    username: profile?.username || 'user',
    firstname: profile?.firstname,
    lastname: profile?.lastname,
    photo: profile?.photo,
    initials:
      profile?.firstname.split('')[0].toUpperCase() +
      profile?.lastname.split('')[0].toUpperCase(),
  };

  return {
    profileData: profileData,
    isLoading: useProfileQuery.isLoading,
    isError: useProfileQuery.isError,
  };
}
