import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CandidateModal = ({ post, onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    manifesto: '',
    photo: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, [post]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get(`/candidates?post=${encodeURIComponent(post)}`);
      setCandidates(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/candidates', {
        ...formData,
        post
      });
      toast.success('Candidate added successfully');
      setShowAddForm(false);
      setFormData({
        name: '',
        department: '',
        year: '',
        manifesto: '',
        photo: ''
      });
      fetchCandidates();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add candidate';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      await api.delete(`/candidates/${id}`);
      toast.success('Candidate deleted successfully');
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Manage Candidates - {post}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mb-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {showAddForm ? 'Cancel' : 'Add Candidate'}
          </button>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manifesto
                </label>
                <textarea
                  name="manifesto"
                  required
                  value={formData.manifesto}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Candidate
              </button>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No candidates for this post yet.
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">
                        {candidate.department} - Year {candidate.year}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{candidate.manifesto}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Votes: {candidate.votesCount || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(candidate._id)}
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;

