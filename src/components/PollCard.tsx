import React from 'react';
import { usePollStore } from '@/store/pollStore';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

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
  votes: any[];
}

interface PollCardProps {
  poll: Poll;
  userId: string | null;
}

const PollCard: React.FC<PollCardProps> = ({ poll, userId }) => {
  const { submitVote, userVotes } = usePollStore();
  const userVoteOptionId = userVotes[poll.id];
  const hasVoted = !!userVoteOptionId;

  const totalVotes = poll.options.reduce((sum, option) => sum + (option._count?.votes || 0), 0);

  const handleVote = async (optionId: string) => {
    if (!userId) {
      // You might want to trigger a login modal here
      alert('Please log in to vote.');
      return;
    }
    if (hasVoted) return; // Prevent re-voting
    await submitVote(poll.id, optionId, userId);
  };

  return (
    <Card className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-lg flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{poll.title}</CardTitle>
        {poll.description && <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">{poll.description}</p>}
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {poll.options.map((option) => {
          const voteCount = option._count?.votes || 0;
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isUserChoice = userVoteOptionId === option.id;

          return (
            <div key={option.id} onClick={() => handleVote(option.id)} className={`relative p-3 rounded-lg transition-all duration-200 ${hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
              <motion.div
                className={`absolute top-0 left-0 h-full rounded-lg ${isUserChoice ? 'bg-indigo-200 dark:bg-indigo-800/50' : 'bg-gray-100 dark:bg-gray-700/30'}`}
                initial={{ width: 0 }}
                animate={{ width: hasVoted ? `${percentage}%` : '0%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasVoted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {isUserChoice ? <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                    </motion.div>
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <span className={`font-medium ${isUserChoice ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-800 dark:text-gray-200'}`}>{option.text}</span>
                </div>
                {hasVoted && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-semibold ${isUserChoice ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-400'}`}>{percentage.toFixed(0)}%</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({voteCount})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700/60">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={poll.createdBy?.image || ''} />
                    <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">{poll.createdBy?.name?.[0] || 'A'}</AvatarFallback>
                </Avatar>
                <span>{poll.createdBy.name || 'Admin'}</span>
            </div>
            <span>{format(new Date(poll.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <div className="w-full text-center mt-3">
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">{totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PollCard;
