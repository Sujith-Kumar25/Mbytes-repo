const AdminPostCard = ({ stat, onAnnounceResult, onViewResult, onManageCandidates }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{stat.post}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Votes:</span>
          <span className="font-medium">{stat.totalVotes}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Candidates:</span>
          <span className="font-medium">{stat.candidatesCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${stat.announced ? 'text-green-600' : 'text-yellow-600'}`}>
            {stat.announced ? 'Announced' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onManageCandidates(stat.post)}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
        >
          Manage Candidates
        </button>
        {stat.announced ? (
          <button
            onClick={() => onViewResult(stat.post)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            View Result
          </button>
        ) : (
          <button
            onClick={() => onAnnounceResult(stat.post)}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
          >
            Announce Result
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPostCard;

