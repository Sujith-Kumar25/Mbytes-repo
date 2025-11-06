import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import CandidateCard from '../components/CandidateCard';

const PostDetail = () => {
  const { post } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [candidates, setCandidates] = useState(location.state?.candidates || []);
  const [hasVoted, setHasVoted] = useState(location.state?.hasVoted || false);
  const [loading, setLoading] = useState(!location.state?.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!location.state?.candidates) {
      fetchCandidates();
    }
  }, [post]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get(`/candidates?post=${encodeURIComponent(post)}`);
      setCandidates(res.data.data);
      
      // Check if user has voted
      if (user?.votedPosts?.includes(post)) {
        setHasVoted(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
      setLoading(false);
    }
  };

  const handleVote = (candidateId) => {
    if (hasVoted) {
      toast.error('You have already voted for this post');
      return;
    }
    setSelectedCandidate(candidateId);
    setShowConfirm(true);
  };

  const confirmVote = async () => {
    try {
      const res = await api.post('/votes', {
        candidateId: selectedCandidate
      });

      if (res.data.success) {
        toast.success('Vote submitted successfully!');
        setHasVoted(true);
        updateUser({
          ...user,
          votedPosts: [...(user.votedPosts || []), post]
        });
        setShowConfirm(false);
        setTimeout(() => {
          navigate('/thank-you', { state: { post } });
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit vote';
      toast.error(message);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{post}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasVoted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-2xl mb-2">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              You have already voted for this post
            </h2>
            <p className="text-gray-600">
              Thank you for participating in the election!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Select a Candidate
              </h2>
              <p className="text-gray-600">
                Choose your preferred candidate for {post}
              </p>
            </div>

            {candidates.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No candidates available for this post yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    onVote={handleVote}
                    disabled={hasVoted}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Your Vote
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to vote for this candidate? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVote}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Confirm Vote
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostDetail;

