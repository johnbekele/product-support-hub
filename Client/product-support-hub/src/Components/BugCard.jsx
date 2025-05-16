// components/BugCard.js
import React from 'react';
import BugHeader from './BugHeader';
import BugDetails from './BugDetails';

function BugCard({
  bug,
  isExpanded,
  onToggleExpand,
  onCommentSubmit,
  onResolutionSubmit,
  onVote,
  onLike,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg">
      <BugHeader bug={bug} onClick={onToggleExpand} />

      {isExpanded && (
        <BugDetails
          bug={bug}
          onCommentSubmit={onCommentSubmit}
          onResolutionSubmit={onResolutionSubmit}
          onVote={onVote}
          onLike={onLike}
        />
      )}
    </div>
  );
}

export default BugCard;
