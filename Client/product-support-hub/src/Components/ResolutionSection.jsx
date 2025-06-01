// components/ResolutionSection.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

function ResolutionSection({ bug }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Resolution</h3>

      {bug.status.toLowerCase() === 'resolved' ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700">
            {bug.resolution ? bug.resolution : 'No resolution'}
          </p>
        </div>
      ) : bug.status.toLowerCase() === 'in progress' ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <p className="text-blue-700">
              Work in progress. Our team is currently addressing this issue.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">
            This bug is open and awaiting resolution.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResolutionSection;
