import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

interface PollState {
  polls: Poll[];
  userVotes: Record<string, string>; // pollId: optionId
  fetchPolls: () => Promise<void>;
  createPoll: (newPoll: { title: string; description?: string; options: string[] }, userId: string) => Promise<void>;
  submitVote: (pollId: string, optionId: string, userId: string) => Promise<void>;
}

export const usePollStore = create<PollState>()(
  immer((set, get) => ({
    polls: [],
    userVotes: {},

    fetchPolls: async () => {
      try {
        const response = await fetch('/api/polls');
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }
        const data: Poll[] = await response.json();
        set(state => {
          state.polls = data;
          // Rehydrate userVotes from the fetched polls
          data.forEach(poll => {
            if (poll.votes && poll.votes.length > 0) {
              state.userVotes[poll.id] = poll.votes[0].optionId;
            }
          });
        });
      } catch (error) {
        console.error('Error fetching polls:', error);
        // Handle error (e.g., show a toast notification)
      }
    },

    createPoll: async (newPollData, userId) => {
      // Optimistic update: Add a temporary poll immediately
      const tempId = `temp-${Date.now()}`;
      const tempPoll: Poll = {
        id: tempId,
        title: newPollData.title,
        description: newPollData.description || null,
        createdAt: new Date().toISOString(),
        createdById: userId,
        createdBy: { id: userId, name: 'You', email: null }, // Replace with actual user info
        options: newPollData.options.map(opt => ({ id: `temp-opt-${Date.now()}-${Math.random()}`, text: opt, pollId: tempId, _count: { votes: 0 } })),
        votes: [],
      };

      set(state => {
        state.polls.unshift(tempPoll); // Add to the beginning
      });

      try {
        const response = await fetch('/api/polls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'CREATE_POLL', ...newPollData }),
        });

        if (!response.ok) {
          throw new Error('Failed to create poll');
        }

        const createdPoll: Poll = await response.json();
        set(state => {
          const index = state.polls.findIndex(p => p.id === tempId);
          if (index !== -1) {
            state.polls[index] = createdPoll; // Replace temporary poll with actual one
          }
        });
      } catch (error) {
        console.error('Error creating poll:', error);
        set(state => {
          state.polls = state.polls.filter(p => p.id !== tempId); // Revert optimistic update
        });
        // Handle error
      }
    },

    submitVote: async (pollId, optionId, userId) => {
      // Optimistic update: Update vote count and user's vote immediately
      set(state => {
        // If user already voted, revert previous vote first
        const previousOptionId = state.userVotes[pollId];
        if (previousOptionId) {
          const pollIndex = state.polls.findIndex(p => p.id === pollId);
          if (pollIndex !== -1) {
            const optionIndex = state.polls[pollIndex].options.findIndex(opt => opt.id === previousOptionId);
            if (optionIndex !== -1) {
              state.polls[pollIndex].options[optionIndex]._count.votes--;
            }
          }
        }

        // Apply new vote
        const pollIndex = state.polls.findIndex(p => p.id === pollId);
        if (pollIndex !== -1) {
          const optionIndex = state.polls[pollIndex].options.findIndex(opt => opt.id === optionId);
          if (optionIndex !== -1) {
            state.polls[pollIndex].options[optionIndex]._count.votes++;
            state.userVotes[pollId] = optionId;
          }
        }
      });

      try {
        const response = await fetch('/api/polls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'SUBMIT_VOTE', pollId, optionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit vote');
        }

        // No need to update state from response if optimistic update was successful
      } catch (error) {
        console.error('Error submitting vote:', error);
        // Revert optimistic update on error
        set(state => {
          const pollIndex = state.polls.findIndex(p => p.id === pollId);
          if (pollIndex !== -1) {
            const currentOptionIndex = state.polls[pollIndex].options.findIndex(opt => opt.id === optionId);
            if (currentOptionIndex !== -1) {
              state.polls[pollIndex].options[currentOptionIndex]._count.votes--;
            }
            // Reapply previous vote if it existed
            const previousOptionId = get().userVotes[pollId]; // Get the actual previous vote before the failed optimistic update
            if (previousOptionId) {
              const prevOptionIndex = state.polls[pollIndex].options.findIndex(opt => opt.id === previousOptionId);
              if (prevOptionIndex !== -1) {
                state.polls[pollIndex].options[prevOptionIndex]._count.votes++;
              }
            } else {
              delete state.userVotes[pollId]; // Remove the vote if there was no previous vote
            }
          }
        });
        // Handle error
      }
    },
  })),
);
