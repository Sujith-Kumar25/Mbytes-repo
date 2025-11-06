import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AdminPostCard from '../components/AdminPostCard';
import CandidateModal from '../components/CandidateModal';
import ResultModal from '../components/ResultModal';
import UsersModal from '../components/UsersModal';

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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { results, setResults } = useSocket();
  const [postsStats, setPostsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [announcedResults, setAnnouncedResults] = useState({});

  useEffect(() => {
    fetchStats();
    fetchResults();
  }, []);

  useEffect(() => {
    if (Object.keys(results).length > 0) {
      setAnnouncedResults((prev) => ({
        ...prev,
        ...results
      }));
    }
  }, [results]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/results/stats/all');
      setPostsStats(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

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

  const handleAnnounceResult = async (post) => {
    try {
      const res = await api.post(`/results/announce/${encodeURIComponent(post)}`);
      
      if (res.data.success) {
        toast.success(`Result announced for ${post}`);
        const result = res.data.data;
        setAnnouncedResults((prev) => ({
          ...prev,
          [post]: result
        }));
        setResults((prev) => ({
          ...prev,
          [post]: result
        }));
        fetchStats();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to announce result';
      toast.error(message);
    }
  };

  const handleViewResult = (post) => {
    setSelectedPost(post);
    setShowResultModal(true);
  };

  const handleManageCandidates = (post) => {
    setSelectedPost(post);
    setShowCandidateModal(true);
  };

  const handleExport = async (type) => {
    try {
      const endpoint = type === 'results-csv' 
        ? '/export/results/csv'
        : type === 'results-pdf'
        ? '/export/results/pdf'
        : '/export/votes/csv';
      
      const res = await api.get(endpoint, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      if (type === 'results-csv') {
        link.setAttribute('download', 'election-results.csv');
      } else if (type === 'results-pdf') {
        link.setAttribute('download', 'election-results.pdf');
      } else {
        link.setAttribute('download', 'election-votes.csv');
      }
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export successful');
    } catch (error) {
      toast.error('Failed to export data');
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUsersModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                View Users
              </button>
              <div className="relative group">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <button
                    onClick={() => handleExport('results-csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export Results (CSV)
                  </button>
                  <button
                    onClick={() => handleExport('results-pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export Results (PDF)
                  </button>
                  <button
                    onClick={() => handleExport('votes-csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export Votes (CSV)
                  </button>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forum Committee Members Section */}
        {Object.keys(announcedResults).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Forum Committee Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(announcedResults).map((result) => (
                <div
                  key={result.post}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-2 border-yellow-400"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{result.post}</h3>
                  <div className="text-xl font-bold text-yellow-700">
                    {result.winnerName || result.winner?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.winnerDepartment || result.winner?.department}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Statistics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {postsStats.map((stat) => (
              <AdminPostCard
                key={stat.post}
                stat={stat}
                onAnnounceResult={handleAnnounceResult}
                onViewResult={handleViewResult}
                onManageCandidates={handleManageCandidates}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCandidateModal && (
        <CandidateModal
          post={selectedPost}
          onClose={() => {
            setShowCandidateModal(false);
            setSelectedPost(null);
            fetchStats();
          }}
        />
      )}

      {showResultModal && (
        <ResultModal
          post={selectedPost}
          onClose={() => {
            setShowResultModal(false);
            setSelectedPost(null);
          }}
        />
      )}

      {showUsersModal && (
        <UsersModal
          onClose={() => setShowUsersModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

