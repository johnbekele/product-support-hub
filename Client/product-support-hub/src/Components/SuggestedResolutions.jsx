// components/SuggestedResolutions.js
import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { formatDate } from '../utils/bugHelpers';

function SuggestedResolutions({ resolutions, onSubmit, onVote }) {
  const [newResolution, setNewResolution] = useState('');

  const handleSubmit = () => {
    onSubmit(newResolution);
    setNewResolution('');
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Suggested Resolutions{' '}
        {resolutions.length > 0 && `(${resolutions.length})`}
      </h3>

      {resolutions.length > 0 ? (
        <div className="space-y-4">
          {resolutions
            .sort((a, b) => b.votes - a.votes)
            .map((resolution) => (
              <div
                key={resolution.id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <button
                      onClick={() => onVote(resolution.id, true)}
                      className="text-gray-500 hover:text-green-500 focus:outline-none"
                    >
                      <FaThumbsUp />
                    </button>
                    <span className="text-lg font-medium my-1">
                      {resolution.votes}
                    </span>
                    <button
                      onClick={() => onVote(resolution.id, false)}
                      className="text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <FaThumbsDown />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{resolution.text}</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>{resolution.user}</span>
                      <span>{formatDate(resolution.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No suggested resolutions yet. Be the first to suggest one!
        </p>
      )}

      {/* Add resolution form */}
      <div className="mt-4">
        <textarea
          value={newResolution}
          onChange={(e) => setNewResolution(e.target.value)}
          placeholder="Suggest a resolution for this bug..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={!newResolution.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Resolution
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuggestedResolutions;
