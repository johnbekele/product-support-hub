// components/EmptyState.js
import React from 'react';
import { FaBug } from 'react-icons/fa';

function EmptyState() {
  return (
    <div className="text-center py-12">
      <FaBug className="mx-auto text-gray-400 text-5xl mb-4" />
      <h3 className="text-xl font-medium text-gray-600">No bugs found</h3>
      <p className="text-gray-500">
        There are no bugs reported in the system yet.
      </p>
    </div>
  );
}

export default EmptyState;
