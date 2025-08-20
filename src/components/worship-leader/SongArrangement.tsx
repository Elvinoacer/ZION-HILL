import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Music, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  likes: number;
  createdAt: string;
  hasLiked?: boolean;
  likesByUsers?: { userId: string }[];
}

interface SortableSongItemProps {
  id: string;
  song: Song;
}

const SortableSongItem: React.FC<SortableSongItemProps> = ({ id, song }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.01 }}
      className="flex items-center p-3 rounded-lg bg-white shadow-xs border border-gray-100 mb-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 mr-2 text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
        <Music className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 truncate">{song.title}</p>
        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
      </div>
      <div className="text-sm text-gray-400 ml-2">
        {song.youtubeUrl && (
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
            YouTube
          </a>
        )}
        {song.spotifyUrl && (
          <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline ml-2">
            Spotify
          </a>
        )}
      </div>
    </motion.li>
  );
};

interface SongArrangementProps {
  songs: Song[];
  worshipSetId: string; // New prop
  allSongProposals: Song[]; // New prop: all available songs
}

const SongArrangement: React.FC<SongArrangementProps> = ({
  songs: initialSongs,
  worshipSetId,
  allSongProposals,
}) => {
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  // Filter available songs: those not already in the current arrangement
  const availableSongs = allSongProposals.filter(
    (proposal) => !songs.some((arrangedSong) => arrangedSong.id === proposal.id)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSongs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddSongToArrangement = (songToAdd: Song) => {
    setSongs((prevSongs) => [...prevSongs, songToAdd]);
    // Automatically save the arrangement after adding a song
    // This will trigger handleSaveArrangement with the updated 'songs' state
    // A small delay might be needed if state update is not immediate
    setTimeout(() => {
      handleSaveArrangement();
    }, 0);
  };

  const handleSaveArrangement = async () => {
    try {
      const arrangedSongIds = songs.map(song => song.id);
      const res = await fetch(`/api/worship-sets?id=${worshipSetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arrangedSongs: arrangedSongIds }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save arrangement");
      }

      toast.success("Song arrangement saved successfully!");
    } catch (err: any) {
      toast.error("Error saving arrangement", {
        description: err.message,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100"
    >
      <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
        <Music className="h-5 w-5 text-purple-600" />
        <span>Song Arrangement</span>
      </h4>
      <p className="text-sm text-gray-500">
        Drag and drop to reorder the worship set
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={songs} strategy={verticalListSortingStrategy}>
          <ul>
            <AnimatePresence>
              {songs.map((song) => (
                <SortableSongItem key={song.id} id={song.id} song={song} />
              ))}
            </AnimatePresence>
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveArrangement}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          Save Arrangement
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        <h4 className="font-semibold text-lg text-gray-700 flex items-center space-x-2">
          <Music className="h-5 w-5 text-gray-600" />
          <span>Available Songs</span>
        </h4>
        {availableSongs.length > 0 ? (
          <ul className="space-y-2">
            {availableSongs.map((song) => (
              <motion.li
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white shadow-xs border border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{song.title}</p>
                  <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddSongToArrangement(song)}
                  className="ml-4 bg-green-500 hover:bg-green-600"
                >
                  Add
                </Button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>All available songs are already in the arrangement.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SongArrangement;