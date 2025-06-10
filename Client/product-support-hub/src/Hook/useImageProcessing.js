import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { resolveElements } from 'framer-motion';

// Get the auth token (if needed, add it to headers in axios calls)
const getToken = () => localStorage.getItem('token');

const uploadAndProcessImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(
    `${API_URL}/image/process-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

const uploadOCRImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${API_URL}/image/image-ocr`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export function useImageProcessing() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: uploadAndProcessImage,
    onError: (error) => {
      console.error('Error processing image:', error);
      toast.error(error.response?.data?.message || 'Failed to process image');
    },
  });

  const processImage = (file) => {
    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    toast.loading('Processing image...', { id: 'processing' });
    mutation.mutate(file, {
      onSuccess: () => {
        toast.dismiss('processing');
        toast.success('Image processed successfully!');
      },
      onError: () => {
        toast.dismiss('processing');
      },
    });
  };

  // For OCR processing
  const ocrMutation = useMutation({
    mutationFn: uploadOCRImage,
    onError: (error) => {
      console.error('Error processing OCR image:', error);
      toast.error(
        error.response?.data?.message || 'Failed to process OCR image'
      );
    },
  });
  const processOCRImage = (file) => {
    if (!file) {
      toast.error('Please select an image file for OCR');
      return Promise.reject(new Error('No file selected'));
    }

    toast.loading('Processing OCR image...', { id: 'ocrProcessing' });

    return new Promise((resolve, reject) => {
      ocrMutation.mutate(file, {
        onSuccess: (data) => {
          toast.dismiss('ocrProcessing');
          toast.success('OCR image processed successfully!');
          resolve(data);
        },
        onError: (error) => {
          toast.dismiss('ocrProcessing');
          reject(error);
        },
      });
    });
  };

  return {
    processImage,
    processOCRImage,
    isLoading: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
