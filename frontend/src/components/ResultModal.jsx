import { useState, useEffect } from 'react';
import api from '../utils/api';

const ResultModal = ({ post, onClose }) => {
  const [result, setResult] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [post]);

  const fetchResult = async () => {
    try {
      const res = await api.get(`/results/stats/${encodeURIComponent(post)}`);
      setResult(res.data.data.result);
      setCandidates(res.data.data.candidates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching result:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Result - {post}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {result && result.announced ? (
            <div className="mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Winner</h3>
                <div className="text-2xl font-bold text-yellow-700 mb-2">
                  {result.winnerName || result.winner?.name}
                </div>
                <div className="text-gray-600">
                  <p>{result.winnerDepartment || result.winner?.department}</p>
                  <p>Year: {result.winnerYear || result.winner?.year}</p>
                  <p className="mt-2">Total Votes: {result.totalVotes}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">Result not announced yet.</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Candidates</h3>
            <div className="space-y-2">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className={`p-4 rounded-lg border ${
                    result && result.winner && result.winner._id === candidate._id
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">
                        {index + 1}. {candidate.name}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({candidate.department} - Year {candidate.year})
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {candidate.votesCount || 0} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

