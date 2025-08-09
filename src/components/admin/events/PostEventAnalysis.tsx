import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { FileText, Camera } from "lucide-react";

type Feedback = {
  id: number;
  eventId: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  comment: string;
};

type Media = {
  id: number;
  eventId: number;
  type: "photo" | "video";
  url: string;
  tags: string[];
};

export default function PostEventAnalysis() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: 1, eventId: 1, sentiment: "Positive", comment: "Great event!" },
    {
      id: 2,
      eventId: 1,
      sentiment: "Neutral",
      comment: "Good but could improve food.",
    },
  ]);

  const [media, setMedia] = useState<Media[]>([
    {
      id: 1,
      eventId: 1,
      type: "photo",
      url: "/photos/youth-camp.jpg",
      tags: ["John Smith", "Youth"],
    },
  ]);

  const data = [{ name: "Youth Camp", Positive: 1, Neutral: 1, Negative: 0 }];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Post-Event Analysis
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Feedback Analysis
          </h3>
          <BarChart width={600} height={300} data={data} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Positive" fill="#16a34a" />
            <Bar dataKey="Neutral" fill="#eab308" />
            <Bar dataKey="Negative" fill="#dc2626" />
          </BarChart>
          <div className="mt-4 space-y-2">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div
                    className={`font-semibold ${
                      feedback.sentiment === "Positive"
                        ? "text-green-600"
                        : feedback.sentiment === "Neutral"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {feedback.sentiment}
                  </div>
                  <div className="text-sm text-gray-600">
                    {feedback.comment}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Media Archive</h3>
          <div className="mt-4 space-y-2">
            {media.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Camera className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {item.type === "photo" ? "Photo" : "Video"}
                  </div>
                  <div className="text-sm text-gray-600">
                    URL: {item.url} | Tags: {item.tags.join(", ")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
