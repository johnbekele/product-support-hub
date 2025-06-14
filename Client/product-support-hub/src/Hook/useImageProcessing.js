import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { toast } from 'react-hot-toast';

// Get the auth token (if needed, add it to headers in axios calls)
const getToken = () => localStorage.getItem('token');

// Function to convert image to grayscale before processing
const convertToGrayscale = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert to grayscale with contrast enhancement
        const contrast = 1.5; // Increase contrast
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

          // Apply contrast enhancement
          const newValue = factor * (avg - 128) + 128;

          data[i] = newValue; // R
          data[i + 1] = newValue; // G
          data[i + 2] = newValue; // B
          // Alpha channel remains unchanged
        }

        // Put the grayscale data back
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          // Create a new file from the blob
          const grayscaleFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: new Date().getTime(),
          });
          resolve(grayscaleFile);
        }, 'image/png');
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

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
  try {
    // Convert to grayscale before sending for OCR
    const grayscaleFile = await convertToGrayscale(imageFile);

    const formData = new FormData();
    formData.append('image', grayscaleFile);

    const response = await axios.post(`${API_URL}/image/image-ocr`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in grayscale conversion or OCR:', error);
    throw error;
  }
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

  // For OCR processing with grayscale conversion
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
    isLoading: mutation.isPending || ocrMutation.isPending,
    result: mutation.data,
    error: mutation.error || ocrMutation.error,
    isError: mutation.isError || ocrMutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
