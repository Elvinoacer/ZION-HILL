"use client";
import { motion } from "framer-motion";
import { Package, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useEventStore, useResourceStore } from "@/store";
import { Resource, Event, ResourceAllocation as PrismaResourceAllocation } from "@/generated/prisma";

interface ResourceAllocationProps {
  // No props needed as data is fetched from stores
}

export default function ResourceAllocation() {
  const { events, loading: eventLoading, error: eventError, fetchEvents } = useEventStore();
  const { resources, equipment, loading: resourceLoading, error: resourceError, fetchResources, fetchEquipment } = useResourceStore();

  const [allocations, setAllocations] = useState<PrismaResourceAllocation[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchResources();
    fetchEquipment();
  }, [fetchEvents, fetchResources, fetchEquipment]);

  const [, drop] = useDrop({
    accept: "RESOURCE",
    drop: (item: Resource, monitor) => {
      // In a real app, you would call a Zustand action here to create a new resource allocation
      console.log("Allocating resource:", item);
      setAllocations((prev) => [
        ...prev,
        {
          id: `new-allocation-${prev.length + 1}`,
          eventId: events[0]?.id || "", // Placeholder, ideally select an event
          resourceId: item.id,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    },
  });

  if (eventLoading || resourceLoading) return <div className="text-center py-8">Loading resource allocation data...</div>;
  if (eventError || resourceError) return <div className="text-center py-8 text-red-500">Error: {eventError || resourceError}</div>;

  const availableResources = [...resources, ...equipment];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resource Allocation
      </h2>
      <div className="flex space-x-6">
        <div className="w-1/3">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Resources
          </h3>
          <div className="mt-4 space-y-2">
            {availableResources.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No available resources.
              </div>
            ) : (
              availableResources.map((resource) => (
                <DraggableResource key={resource.id} resource={resource} />
              ))
            )}
          </div>
        </div>
        <div
          ref={drop}
          className="w-2/3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Event: {events[0]?.title || "Select an Event"}
          </h3>
          <div className="mt-4 space-y-2">
            {allocations.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Drag resources here to allocate them to the event.
              </div>
            ) : (
              allocations.map((allocation, index) => (
                <motion.div
                  key={allocation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 bg-white rounded-lg shadow-sm flex items-center"
                >
                  {/* Assuming resource.type can differentiate between equipment and teams */}
                  {allocation.resourceId ? (
                    <Package className="h-5 w-5 text-blue-600 mr-2" />
                  ) : (
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <span>{allocation.resourceId}</span> {/* Display resource ID for now */}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableResource({ resource }: { resource: Resource }) {
  const [{ isDragging }, drag] = useDrag({
    type: "RESOURCE",
    item: resource,
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
      {resource.type === "EQUIPMENT" ? (
        <Package className="h-5 w-5 text-blue-600 mr-2" />
      ) : (
        <Users className="h-5 w-5 text-green-600 mr-2" />
      )}
      <span>{resource.name}</span>
    </div>
  );
}
