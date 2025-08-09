import { Download } from "lucide-react";

export default function StudyMaterials() {
  const materials = [
    {
      id: 1,
      title: "Romans Study Guide",
      author: "Discipleship Team",
      pages: 24,
      downloads: 87,
    },
    // More materials...
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-bold mb-4">Study Materials</h3>
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="border-b border-gray-200 pb-4 last:border-0"
          >
            <div className="font-medium">{material.title}</div>
            <div className="text-sm text-gray-600 mb-2">
              {material.author} • {material.pages} pages
            </div>
            <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
              <Download className="mr-1 h-4 w-4" /> Download (
              {material.downloads})
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        View All Materials →
      </button>
    </div>
  );
}
