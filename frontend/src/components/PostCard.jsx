import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, candidates, hasVoted, isAnnounced }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${encodeURIComponent(post)}`, {
      state: { candidates, hasVoted, isAnnounced }
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {candidates.length} {candidates.length === 1 ? 'candidate' : 'candidates'}
      </p>
      <div className="flex items-center justify-between">
        {hasVoted ? (
          <span className="text-sm text-green-600 font-medium">✓ Voted</span>
        ) : (
          <span className="text-sm text-gray-500">Not voted</span>
        )}
        {isAnnounced && (
          <span className="text-sm text-blue-600 font-medium">Result Announced</span>
        )}
      </div>
    </div>
  );
};

export default PostCard;

