// utils/bugHelpers.js
import React from 'react';
import {
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaBug,
} from 'react-icons/fa';

export const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return <FaCheckCircle className="text-green-500" />;
    case 'in progress':
      return <FaSpinner className="text-blue-500" />;
    case 'open':
      return <FaExclamationTriangle className="text-yellow-500" />;
    default:
      return <FaBug className="text-gray-500" />;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
