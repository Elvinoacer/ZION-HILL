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

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
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
      <div className="text-sm text-gray-400 ml-2">{song.duration}</div>
    </motion.li>
  );
};

interface SongArrangementProps {
  songs: Song[];
}

const SongArrangement: React.FC<SongArrangementProps> = ({
  songs: initialSongs,
}) => {
  const [songs, setSongs] = useState<Song[]>(initialSongs);

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
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
          Save Arrangement
        </Button>
      </div>
    </motion.div>
  );
};

export default SongArrangement;
