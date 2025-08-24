import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

const FileAttachment = ({ file }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (file.type.startsWith('image/')) {
    return (
      <div className="file-attachment image-attachment mb-1">
        <img
          src={file.url}
          alt={file.name}
          className="max-h-48 rounded-lg object-contain"
        />
      </div>
    );
  }

  return (
    <div className="file-attachment document-attachment mb-1 p-2 bg-gray-100 rounded-lg flex items-center">
      <DocumentIcon className="w-6 h-6 text-gray-500 mr-2" />
      <div className="file-info">
        <div className="file-name text-sm font-medium truncate max-w-[200px]">
          {file.name}
        </div>
        <div className="file-size text-xs text-gray-500">
          {formatFileSize(file.size)}
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;