// FileUploadArea.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useImageProcessing } from '../Hook/useImageProcessing.js'; // Import your hook

/**
 * FileUploadArea Component
 *
 * A versatile file upload component that supports:
 * - Drag and drop
 * - File selection via button
 * - Clipboard paste for screenshots
 * - Preview for images
 * - AI processing integration
 *
 * @param {Object} props
 * @param {Function} props.onProcessingComplete - Callback when AI processing is complete
 * @param {Function} props.onFileRemoved - Callback when file is removed
 * @param {Object} props.theme - Theme object for styling
 * @param {Array} props.acceptedTypes - Array of accepted MIME types
 * @param {Number} props.maxSize - Maximum file size in bytes
 */
const FileUploadArea = ({
  onProcessingComplete,
  onFileRemoved,
  theme,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Use the image processing hook
  const {
    processImage,
    isLoading,
    result,
    error: processingError,
    isSuccess,
    reset: resetProcessing,
  } = useImageProcessing();

  // Handle successful processing
  useEffect(() => {
    if (isSuccess && result) {
      // Pass the result to the parent component
      onProcessingComplete && onProcessingComplete(result, file);
    }
  }, [isSuccess, result, file, onProcessingComplete]);

  // Handle processing errors
  useEffect(() => {
    if (processingError) {
      setError(
        `Processing error: ${processingError.message || 'Unknown error'}`
      );
    }
  }, [processingError]);

  // Handle file selection
  const handleFileSelection = useCallback(
    (selectedFile) => {
      // Reset error state and processing state
      setError(null);
      resetProcessing();

      // Validate file type
      if (!acceptedTypes.includes(selectedFile.type)) {
        setError(
          `File type not supported. Please upload: ${acceptedTypes
            .map((type) => type.split('/')[1])
            .join(', ')}`
        );
        return;
      }

      // Validate file size
      if (selectedFile.size > maxSize) {
        setError(
          `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return;
      }

      // Set file and create preview for images
      setFile(selectedFile);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);

        // Automatically start processing the image
        processImage(selectedFile);
      } else {
        setPreview(null);
      }
    },
    [acceptedTypes, maxSize, processImage, resetProcessing]
  );

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    resetProcessing();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  // Handle drag events
  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [handleFileSelection]
  );

  // Handle click on the drop area
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  // Setup paste event listener for screenshots
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            handleFileSelection(file);
            break;
          }
        }
      }
    };

    // Only add listener if component is mounted
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handleFileSelection]);

  // Setup drag and drop event listeners
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      dropArea.addEventListener('dragenter', handleDragIn);
      dropArea.addEventListener('dragleave', handleDragOut);
      dropArea.addEventListener('dragover', handleDragOver);
      dropArea.addEventListener('drop', handleDrop);

      return () => {
        dropArea.removeEventListener('dragenter', handleDragIn);
        dropArea.removeEventListener('dragleave', handleDragOut);
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('drop', handleDrop);
      };
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  // Styling
  const dropAreaStyle = {
    borderColor: isDragging
      ? theme?.components?.button?.primary?.backgroundColor || '#3B82F6'
      : theme?.colors?.mediumGray || '#E5E7EB',
    backgroundColor: isDragging
      ? theme?.colors?.lightGray || '#F3F4F6'
      : 'transparent',
    fontFamily: theme?.typography?.fontFamily || 'sans-serif',
  };

  const buttonStyle = {
    backgroundColor:
      theme?.components?.button?.secondary?.backgroundColor || '#E5E7EB',
    color: theme?.components?.button?.secondary?.color || '#1F2937',
    fontFamily: theme?.typography?.fontFamily || 'sans-serif',
  };

  const errorStyle = {
    color: theme?.colors?.error || '#DC2626',
    fontFamily: theme?.typography?.fontFamily || 'sans-serif',
  };

  // Render preview or upload area
  if (file) {
    return (
      <div className="file-preview mb-2 rounded-lg border p-2 relative">
        <div className="image-preview relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 rounded object-contain mx-auto"
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
              <div className="loading-spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <motion.button
          className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={handleRemoveFile}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Remove file"
          disabled={isLoading}
        >
          <XMarkIcon className="w-4 h-4" />
        </motion.button>

        {error && (
          <div className="error-message text-xs mt-1" style={errorStyle}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="file-upload-container mb-2">
      <div
        ref={dropAreaRef}
        className={`drop-area border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={handleClick}
        style={dropAreaStyle}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
        />

        <div className="flex flex-col items-center">
          <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Drop image here, <span className="text-blue-500">paste</span> or{' '}
            <motion.button
              className="px-2 py-1 rounded text-sm inline-block"
              style={buttonStyle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse
            </motion.button>
          </p>
          <p className="text-xs text-gray-500">
            Supports:{' '}
            {acceptedTypes.map((type) => type.split('/')[1]).join(', ')}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message text-xs mt-1" style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
