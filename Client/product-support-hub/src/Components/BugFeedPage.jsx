import React, { useState, useEffect, useMemo, useRef } from 'react';
import BugCard from './BugCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { usePost } from '../Hook/usePost';
import { useComment } from '../Hook/useComment';
import { useBugContext } from '../Context/BugContext'; // Import the context hook

function BugFeedPage({ searchTerm, filters }) {
  const [bugs, setBugs] = useState([]);
  const [expandedBug, setExpandedBug] = useState(null);
  const { postdata, isLoading, isError, error } = usePost();
  const { createComment, deleteComment } = useComment();
  const { selectedBugId, setSelectedBugId } = useBugContext(); // Use the context
  const selectedBugRef = useRef(null); // Reference for scrolling to selected bug

  // Update bugs when data loads
  useEffect(() => {
    if (!isLoading && !isError && postdata?.length > 0) {
      setBugs(postdata);
    }
  }, [postdata, isLoading, isError]);

  // Auto-expand and scroll to selected bug when it changes
  useEffect(() => {
    if (selectedBugId) {
      setExpandedBug(selectedBugId);

      // Wait for the DOM to update, then scroll
      setTimeout(() => {
        if (selectedBugRef.current) {
          selectedBugRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  }, [selectedBugId]);

  // Clear selected bug function
  const clearSelectedBug = () => {
    setSelectedBugId(null);
  };

  // Helper functions for filtering
  const matchesSearchTerm = (bug, term) => {
    const lowerTerm = term.toLowerCase();
    return (
      bug.id?.toString().includes(lowerTerm) ||
      bug.title?.toLowerCase().includes(lowerTerm) ||
      bug.description?.toLowerCase().includes(lowerTerm) ||
      bug.tags?.some((tag) => tag.toLowerCase().includes(lowerTerm))
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isThisWeek = (date, now) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    return date >= weekStart && date < weekEnd;
  };

  const isThisMonth = (date, now) => {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isThisQuarter = (date, now) => {
    const quarter = Math.floor(now.getMonth() / 3);
    const dateQuarter = Math.floor(date.getMonth() / 3);

    return dateQuarter === quarter && date.getFullYear() === now.getFullYear();
  };

  // Apply filters to bugs
  const filteredBugs = useMemo(() => {
    if (!bugs.length) return [];

    // If we have a selected bug ID and it exists in our bugs list,
    // prioritize showing that bug at the top
    let prioritizedBugs = [...bugs];

    if (selectedBugId) {
      const selectedBugIndex = bugs.findIndex(
        (bug) => bug.id === selectedBugId
      );
      if (selectedBugIndex !== -1) {
        // Move the selected bug to the top of the array
        const selectedBug = bugs[selectedBugIndex];
        prioritizedBugs = [
          selectedBug,
          ...bugs.slice(0, selectedBugIndex),
          ...bugs.slice(selectedBugIndex + 1),
        ];
      }
    }

    return prioritizedBugs.filter((bug) => {
      // Search term filtering
      if (searchTerm && !matchesSearchTerm(bug, searchTerm)) {
        return false;
      }

      // Apply each filter if it has a value
      if (filters.product && bug.product !== filters.product) return false;
      if (filters.bugType && bug.type !== filters.bugType) return false;
      if (filters.status && bug.status !== filters.status) return false;
      if (filters.severity && bug.severity !== filters.severity) return false;

      // Assignee filtering
      if (filters.assignee) {
        if (filters.assignee === 'unassigned' && bug.assignee) return false;
        if (filters.assignee === 'me' && bug.assignee !== 'current-user-id')
          return false;
        if (
          filters.assignee === 'team' &&
          !bug.assigneeTeam?.includes('user-team-id')
        )
          return false;
      }

      // Date filtering
      if (filters.dateRange !== 'all') {
        const bugDate = new Date(bug.createdAt);
        const now = new Date();

        switch (filters.dateRange) {
          case 'today':
            if (!isSameDay(bugDate, now)) return false;
            break;
          case 'week':
            if (!isThisWeek(bugDate, now)) return false;
            break;
          case 'month':
            if (!isThisMonth(bugDate, now)) return false;
            break;
          case 'quarter':
            if (!isThisQuarter(bugDate, now)) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  }, [bugs, searchTerm, filters, selectedBugId]);

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
              return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
          }),
        };
      }
      return bug;
    });
    setBugs(updatedBugs);
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="text-red-500">Error loading bugs: {error?.message}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Bug Feed</h1>
      <p className="text-gray-600 mb-8">Recent bugs and their resolutions</p>

      {/* Selected Bug Notification */}
      {selectedBugId && (
        <div className="mb-4 flex items-center bg-blue-50 p-3 rounded-lg">
          <div className="flex-grow">
            <span className="text-blue-700 font-medium">
              Viewing Bug #{selectedBugId}
            </span>
            <p className="text-sm text-blue-600">
              This bug was referenced in your chat conversation
            </p>
          </div>
          <button
            onClick={clearSelectedBug}
            className="text-blue-700 hover:text-blue-900"
            aria-label="Clear selected bug"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-6">
        {filteredBugs.length > 0 ? (
          filteredBugs.map((bug) => (
            <div
              key={bug.id}
              ref={bug.id === selectedBugId ? selectedBugRef : null}
              className={`${
                bug.id === selectedBugId
                  ? 'ring-2 ring-blue-500 rounded-lg shadow-md'
                  : ''
              }`}
            >
              <BugCard
                bug={bug}
                isExpanded={expandedBug === bug.id || bug.id === selectedBugId}
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
            </div>
          ))
        ) : (
          <EmptyState
            message={
              selectedBugId
                ? `Bug #${selectedBugId} not found`
                : 'No bugs match your search criteria'
            }
          />
        )}
      </div>
    </div>
  );
}

export default BugFeedPage;
