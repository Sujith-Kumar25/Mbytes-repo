import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import WinnerCard from '../components/WinnerCard';

const POSTS = [
  'President',
  'Vice President',
  'Secretary',
  'Joint Secretary',
  'Treasurer',
  'Event Organizer',
  'Sports Coordinator',
  'Media Coordinator'
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { results } = useSocket();
  const [postsData, setPostsData] = useState({});
  const [announcedResults, setAnnouncedResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    fetchCandidates();
  }, []);

  useEffect(() => {
    // Update announced results when socket receives new data
    if (Object.keys(results).length > 0) {
      setAnnouncedResults((prev) => ({
        ...prev,
        ...results
      }));
    }
  }, [results]);

  const fetchResults = async () => {
    try {
      const res = await api.get('/results');
      const resultsData = {};
      res.data.data.forEach((result) => {
        if (result.announced) {
          resultsData[result.post] = result;
        }
      });
      setAnnouncedResults(resultsData);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates');
      const candidatesByPost = {};
      
      res.data.data.forEach((candidate) => {
        if (!candidatesByPost[candidate.post]) {
          candidatesByPost[candidate.post] = [];
        }
        candidatesByPost[candidate.post].push(candidate);
      });

      setPostsData(candidatesByPost);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-white shadow sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">M-Bytes Forum Election</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Announced Winners Section */}
        {Object.keys(announcedResults).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Forum Committee Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(announcedResults).map((result) => (
                <WinnerCard key={result.post} result={result} />
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {POSTS.map((post) => (
              <PostCard
                key={post}
                post={post}
                candidates={postsData[post] || []}
                hasVoted={user?.votedPosts?.includes(post)}
                isAnnounced={announcedResults[post]?.announced}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

