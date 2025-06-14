// components/BugDetails.js
import React from 'react';
import ResolutionSection from './ResolutionSection';
import SuggestedResolutions from './SuggestedResolutions';
import CommentsSection from './CommentsSection';
import EmailSection from './EmailSection';

function BugDetails({
  bug,
  onCommentSubmit,
  onResolutionSubmit,
  onVote,
  onLike,
  onDelete,
}) {
  return (
    <div className="border-t border-gray-200 p-5 bg-gray-50 animate-fadeIn">
      <ResolutionSection bug={bug} />
      <EmailSection bug={bug} />

      {bug.status.toLowerCase() !== 'resolved' && (
        <SuggestedResolutions
          resolutions={bug.suggestedResolutions}
          onSubmit={onResolutionSubmit}
          onVote={onVote}
        />
      )}

      <CommentsSection
        comments={bug.comments}
        onSubmit={onCommentSubmit}
        onLike={onLike}
        onDelete={onDelete}
      />
    </div>
  );
}

export default BugDetails;
