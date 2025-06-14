// hooks/useEmail.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useMemo } from 'react';

const getToken = () => localStorage.getItem('token');

const fetchEmail = async (bugId) => {
  if (!bugId) throw new Error('Bug ID is required');

  // This is a POST request to generate the email
  const token = getToken();
  const response = await axios.post(
    `${API_URL}/image/generate-email/${bugId}`,
    {}, // Empty body as the bugId is in the URL
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export function useEmail(bugId) {
  const queryClient = useQueryClient();

  // Use mutation for fetching email since it's a POST request
  const emailMutation = useMutation({
    mutationKey: ['email', bugId],
    mutationFn: () => fetchEmail(bugId),
    onSuccess: (data) => {
      // Cache the result after successful fetch
      queryClient.setQueryData(['email', bugId], data);
    },
  });

  // Use query to access cached data
  const emailQuery = useQuery({
    queryKey: ['email', bugId],
    enabled: false, // Don't automatically fetch, we'll use mutation for that
    staleTime: 300000, // 5 minutes
  });

  const emailData = useMemo(() => {
    // Try to get data from either the mutation or the cached query
    const data = emailMutation.data || emailQuery.data;

    if (!data) return null;

    const { email } = data;

    return {
      subject: email?.subject || '',
      bodyHtml: email?.body?.body || '',
      bodyText: email?.body?.subject || '',
      isGenerated: !!email,
    };
  }, [emailMutation.data, emailQuery.data]);

  const generateEmail = () => {
    if (bugId) {
      emailMutation.mutate();
    }
  };

  return {
    emailData,
    generateEmail,
    isGenerating: emailMutation.isPending,
    isLoading: emailMutation.isPending,
    isError: emailMutation.isError,
    error: emailMutation.error,
    isSuccess: emailMutation.isSuccess,
  };
}
