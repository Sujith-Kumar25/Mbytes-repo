const WinnerCard = ({ result }) => {
  if (!result || !result.announced) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-2 border-yellow-400">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{result.post}</h3>
        <div className="mt-4">
          <div className="text-2xl font-bold text-yellow-700 mb-1">
            {result.winner?.name || result.winnerName}
          </div>
          <div className="text-sm text-gray-600">
            {result.winner?.department || result.winnerDepartment}
          </div>
          <div className="text-sm text-gray-600">
            Year: {result.winner?.year || result.winnerYear}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Votes: {result.totalVotes || result.winner?.votesCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;

