// components/CommentsSection.js
import React, { useState } from 'react';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { formatDate } from '../utils/bugHelpers';
import { useAuth } from '../Context/AuthContext';
import { MdDelete } from 'react-icons/md';

function CommentsSection({ comments, onSubmit, onLike, onDelete }) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  console.log('User:', user);

  // console.log('Comments:', comments);

  const handleSubmit = () => {
    onSubmit(newComment);
    setNewComment('');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="text-gray-800">{comment.content}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{comment.user}</span>
                  <span className="mx-1">•</span>
                  {/* <span>{formatDate(comment.timestamp)}</span> */}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLike(comment.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                  >
                    <FaThumbsUp className="mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  {user && user.username === comment.user && (
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                    >
                      <MdDelete className="mr-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">
          No comments yet. Be the first to comment!
        </p>
      )}

      {/* Add comment form */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="2"
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaComment className="inline mr-2" />
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentsSection;
