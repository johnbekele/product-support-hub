import React, { useState, useEffect } from 'react';
import BugCard from './BugCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { usePost } from '../Hook/usePost';
import { useComment } from '../Hook/useComment';

function BugFeedPage() {
  const [bugs, setBugs] = useState([]);
  const [expandedBug, setExpandedBug] = useState(null);
  const { postdata, isLoading, isError, error } = usePost();
  const { createComment, deleteComment } = useComment();

  console.log('Post Data:', postdata);

  // Update bugs only when data loads successfully and is not empty
  useEffect(() => {
    if (!isLoading && !isError && postdata.length > 0) {
      setBugs(postdata);
    }
  }, [postdata, isLoading, isError]);

  // Toggle expanded/collapsed bug details
  const toggleBugExpansion = (bugId) => {
    setExpandedBug(expandedBug === bugId ? null : bugId);
  };

  // Add new comment to a bug
  const handleCommentSubmit = (bugId, commentText) => {
    if (!commentText.trim()) return;

    createComment({ postId: bugId, content: commentText });
  };

  // Delete a comment from a bug
  const handleDelete = (bugId, commentId) => {
    deleteComment(commentId);
  };

  // Add new suggested resolution to a bug
  const handleResolutionSubmit = (bugId, resolutionText) => {
    if (!resolutionText.trim()) return;

    const updatedBugs = bugs.map((bug) => {
      if (bug.id === bugId) {
        return {
          ...bug,
          suggestedResolutions: [
            ...bug.suggestedResolutions,
            {
              id: Date.now(),
              user: 'Current User',
              text: resolutionText,
              timestamp: new Date().toISOString(),
              votes: 0,
            },
          ],
        };
      }
      return bug;
    });

    setBugs(updatedBugs);
  };

  // Upvote/downvote a suggested resolution
  const handleVote = (bugId, resolutionId, increment) => {
    const updatedBugs = bugs.map((bug) => {
      if (bug.id === bugId) {
        return {
          ...bug,
          suggestedResolutions: bug.suggestedResolutions.map((resolution) => {
            if (resolution.id === resolutionId) {
              return {
                ...resolution,
                votes: resolution.votes + (increment ? 1 : -1),
              };
            }
            return resolution;
          }),
        };
      }
      return bug;
    });

    setBugs(updatedBugs);
  };

  // Like a comment on a bug
  const handleLike = (bugId, commentId) => {
    const updatedBugs = bugs.map((bug) => {
      if (bug.id === bugId) {
        return {
          ...bug,
          comments: bug.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.likes + 1,
              };
            }
            return comment;
          }),
        };
      }
      return bug;
    });

    setBugs(updatedBugs);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-red-500">Error loading bugs: {error?.message}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Bug Feed</h1>
      <p className="text-gray-600 mb-8">Recent bugs and their resolutions</p>

      <div className="space-y-6">
        {bugs.length > 0 ? (
          bugs.map((bug) => (
            <BugCard
              key={bug.id}
              bug={bug}
              isExpanded={expandedBug === bug.id}
              onToggleExpand={() => toggleBugExpansion(bug.id)}
              onCommentSubmit={(commentText) =>
                handleCommentSubmit(bug.id, commentText)
              }
              onResolutionSubmit={(resolutionText) =>
                handleResolutionSubmit(bug.id, resolutionText)
              }
              onVote={(resolutionId, increment) =>
                handleVote(bug.id, resolutionId, increment)
              }
              onLike={(commentId) => handleLike(bug.id, commentId)}
              onDelete={(commentId) => handleDelete(bug.id, commentId)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default BugFeedPage;
