import React from 'react';
import { usePollStore } from '@/store/pollStore';

interface PollOption {
  id: string;
  text: string;
  pollId: string;
  _count: { votes: number };
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  createdById: string;
  createdBy: { id: string; name: string | null; email: string | null };
  options: PollOption[];
  votes: any[]; // This will be populated on the server side if needed, or managed optimistically
}

interface PollCardProps {
  poll: Poll;
  userId: string | null;
}

const PollCard: React.FC<PollCardProps> = ({ poll, userId }) => {
  const { submitVote, userVotes } = usePollStore();
  const hasVoted = userVotes[poll.id] !== undefined;
  const userVoteOptionId = userVotes[poll.id];

  const totalVotes = poll.options.reduce((sum, option) => sum + option._count.votes, 0);

  const handleVote = async (optionId: string) => {
    if (!userId) {
      alert('Please log in to vote.');
      return;
    }
    if (hasVoted) {
      alert('You have already voted in this poll.');
      return;
    }
    await submitVote(poll.id, optionId, userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
      {poll.description && <p className="text-gray-600 mb-4">{poll.description}</p>}
      <div className="space-y-2 flex-grow">
        {poll.options.map((option) => (
          <div key={option.id} className="flex items-center">
            <button
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || !userId}
              className={`flex-grow text-left p-3 rounded-lg transition-colors duration-200
                ${hasVoted
                  ? (userVoteOptionId === option.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700')
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }
                ${!userId ? 'cursor-not-allowed opacity-70' : ''}
              `}
            >
              {option.text}
            </button>
            {hasVoted && (
              <span className="ml-3 font-medium text-gray-700">
                {option._count.votes} votes ({totalVotes > 0 ? ((option._count.votes / totalVotes) * 100).toFixed(1) : 0}%)
              </span>
            )}
          </div>
        ))}
      </div>
      {hasVoted && (
        <p className="text-sm text-gray-500 mt-4">
          You voted for: <span className="font-semibold">{poll.options.find(opt => opt.id === userVoteOptionId)?.text}</span>
        </p>
      )}
      <p className="text-sm text-gray-500 mt-auto pt-4 border-t border-gray-200">
        Created by {poll.createdBy.name || poll.createdBy.email} on {new Date(poll.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PollCard;
