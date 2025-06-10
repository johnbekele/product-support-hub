// components/BugHeader.js
import React from 'react';
import { FaUser, FaRegClock } from 'react-icons/fa';
import {
  getSeverityColor,
  getStatusIcon,
  formatDate,
} from '../utils/bugHelpers';
import { useAuth } from '../Context/AuthContext';
import { usePost } from '../Hook/usePost';

function BugHeader({ bug, onClick }) {
  const { user } = useAuth();
  const currentUser = user?.username || 'Unknown User';
  const [buttonText, setButtonText] = React.useState('...');
  const { deletePost } = usePost();
  return (
    <div className="p-5 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {/* <span className="text-sm font-mono text-gray-500">{bug.id}</span> */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(
                bug.severity
              )}`}
            >
              {bug.severity}
            </span>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              {bug.product}
            </span>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              {bug.type}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{bug.title}</h2>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon(bug.status)}
          <span
            className={`text-sm font-medium ${
              bug.status.toLowerCase() === 'resolved'
                ? 'text-green-500'
                : bug.status.toLowerCase() === 'in progress'
                ? 'text-blue-500'
                : 'text-yellow-500'
            }`}
          >
            {bug.status}
          </span>
          {currentUser === bug.createdBy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePost(bug.id);
              }}
              onMouseEnter={() => {
                setButtonText('delete');
              }}
              onMouseLeave={() => setButtonText('...')}
              className={`text-sm font-medium mb-1.5 `}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-600 mt-2">{bug.description}</p>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <FaUser className="text-gray-400" />
          <span>{currentUser == bug.createdBy ? 'You' : bug.createdBy}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaRegClock className="text-gray-400" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default BugHeader;
