const CandidateCard = ({ candidate, onVote, disabled }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {candidate.photo && (
        <div className="mb-4">
          <img
            src={candidate.photo}
            alt={candidate.name}
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{candidate.name}</h3>
      <div className="text-sm text-gray-600 mb-2">
        <p>{candidate.department}</p>
        <p>Year: {candidate.year}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-700">{candidate.manifesto}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {candidate.votesCount || 0} votes
        </span>
        <button
          onClick={() => onVote(candidate._id)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;

