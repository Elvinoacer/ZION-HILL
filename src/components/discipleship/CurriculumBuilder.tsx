import { motion } from "framer-motion";
import { FileText, Video } from "lucide-react";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

type Lesson = {
  id: number;
  title: string;
  type: "video" | "pdf" | "text";
  url?: string;
  content?: string;
};

export default function CurriculumBuilder() {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Introduction to Romans",
      type: "video",
      url: "/videos/romans.mp4",
    },
    {
      id: 2,
      title: "Study Guide: Romans",
      type: "pdf",
      url: "/pdfs/romans-guide.pdf",
    },
  ]);

  const [, drop] = useDrop({
    accept: "LESSON",
    drop: (item: Lesson, monitor) => {
      setLessons((prev) => [...prev, { ...item, id: prev.length + 1 }]);
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Curriculum Builder
      </h2>
      <div className="flex space-x-6">
        <div className="w-1/3">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Resources
          </h3>
          <div className="mt-4 space-y-2">
            {[
              {
                id: 3,
                title: "Prayer Basics",
                type: "video",
                url: "/videos/prayer.mp4",
              },
              {
                id: 4,
                title: "Psalms Study",
                type: "pdf",
                url: "/pdfs/psalms.pdf",
              },
            ].map((resource) => (
              <DraggableLesson key={resource.id} lesson={resource} />
            ))}
          </div>
        </div>
        <div
          ref={drop}
          className="w-2/3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <h3 className="text-lg font-semibold text-gray-900">Lesson Plan</h3>
          <div className="mt-4 space-y-2">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 bg-white rounded-lg shadow-sm flex items-center"
              >
                {lesson.type === "video" ? (
                  <Video className="h-5 w-5 text-blue-600 mr-2" />
                ) : (
                  <FileText className="h-5 w-5 text-green-600 mr-2" />
                )}
                <span>{lesson.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableLesson({ lesson }: { lesson: Lesson }) {
  const [{ isDragging }, drag] = useDrag({
    type: "LESSON",
    item: lesson,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded-lg shadow-sm flex items-center cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {lesson.type === "video" ? (
        <Video className="h-5 w-5 text-blue-600 mr-2" />
      ) : (
        <FileText className="h-5 w-5 text-green-600 mr-2" />
      )}
      <span>{lesson.title}</span>
    </div>
  );
}
