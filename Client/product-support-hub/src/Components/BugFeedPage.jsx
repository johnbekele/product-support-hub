// BugFeedPage.js
import React, { useState, useEffect } from 'react';
import { FaBug } from 'react-icons/fa';
import BugCard from './BugCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

function BugFeedPage() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBug, setExpandedBug] = useState(null);
  // data/mockData.js
  const MOCK_BUGS = [
    {
      id: 'BUG-1024',
      title: 'Dashboard charts fail to load with large datasets',
      description:
        'When loading more than 10,000 data points, the performance charts crash and display a blank screen.',
      product: 'DAPA',
      type: 'Performance',
      severity: 'High',
      status: 'Resolved',
      createdAt: '2023-11-01T10:30:00Z',
      createdBy: 'Alex Johnson',
      resolution:
        'Implemented data pagination and lazy loading to handle large datasets more efficiently.',
      comments: [
        {
          id: 1,
          user: 'Maria Garcia',
          text: 'This was affecting our enterprise customers. Thanks for the quick fix!',
          timestamp: '2023-11-02T14:20:00Z',
          likes: 5,
        },
        {
          id: 2,
          user: 'Raj Patel',
          text: 'The pagination works great now. Could we also add a warning when datasets exceed the recommended size?',
          timestamp: '2023-11-03T09:15:00Z',
          likes: 3,
        },
      ],
      suggestedResolutions: [],
    },
    // ... other bugs
  ];
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBugs(MOCK_BUGS);
      setLoading(false);
    }, 800);
  }, []);

  const toggleBugExpansion = (bugId) => {
    setExpandedBug(expandedBug === bugId ? null : bugId);
  };

  const handleCommentSubmit = (bugId, commentText) => {
    if (!commentText.trim()) return;

    const updatedBugs = bugs.map((bug) => {
      if (bug.id === bugId) {
        return {
          ...bug,
          comments: [
            ...bug.comments,
            {
              id: Date.now(),
              user: 'Current User',
              text: commentText,
              timestamp: new Date().toISOString(),
              likes: 0,
            },
          ],
        };
      }
      return bug;
    });

    setBugs(updatedBugs);
  };

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Bug Feed</h1>
      <p className="text-gray-600 mb-8">Recent bugs and their resolutions</p>

      <div className="space-y-6">
        {bugs.map((bug) => (
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
          />
        ))}
      </div>

      {bugs.length === 0 && <EmptyState />}
    </div>
  );
}

export default BugFeedPage;
