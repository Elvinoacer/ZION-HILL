import { Event, User } from "@/generated/prisma";
import { motion } from "framer-motion";
import { Map, UserPlus } from "lucide-react";
import OutreachMap from "./OutreachMap"; // Import the new map component
interface OutreachCoordinationProps {
  locations: Event[];
  volunteers: User[];
}
const locationsWithCoords22 = [
  {
    id: "1",
    name: "Eiffel Tower",
    latitude: 48.8584,
    longitude: 2.2945,
    description: "The iconic iron lattice tower on the Champ de Mars in Paris.",
  },
  {
    id: "2",
    name: "Statue of Liberty",
    latitude: 40.6892,
    longitude: -74.0445,
    description:
      "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
  },
  {
    id: "3",
    name: "Colosseum",
    latitude: 41.8902,
    longitude: 12.4922,
    description:
      "An oval amphitheatre in the centre of the city of Rome, Italy.",
  },
  {
    id: "4",
    name: "Great Wall of China",
    latitude: 40.4319,
    longitude: 116.5704,
    description:
      "A series of fortifications built along the historical northern borders of ancient Chinese states.",
  },
];
export default function OutreachCoordination({
  locations,
  volunteers,
}: OutreachCoordinationProps) {
  const handleVolunteerSignup = (outreachId: string) => {
    console.log(
      `Processing volunteer signup for outreach ${outreachId} via /api/volunteers`
    );
    // In a real app, you would call a Zustand action here to handle volunteer signup
  };

  // Filter out locations without valid latitude and longitude
  const locationsWithCoords = locations
    .filter((loc) => loc.latitude !== null && loc.longitude !== null)
    .map((loc) => ({
      id: loc.id,
      name: loc.title,
      latitude: loc.latitude!,
      longitude: loc.longitude!,
      description: loc.location || undefined, // Use existing location string as description
    }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Outreach Coordination
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Local Outreach Map
          </h3>
          <div className="mt-4 rounded-lg overflow-hidden">
            {locationsWithCoords.length > 0 ? (
              <OutreachMap locations={locationsWithCoords} />
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-600">
                  No outreach locations with coordinates found to display on
                  map.
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {locations.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No outreach locations found.
              </div>
            ) : (
              locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Map className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {location.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Type: {location.type}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Volunteer Sign-Up
          </h3>
          <div className="mt-4 space-y-2">
            {locations.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No outreach locations for volunteer signup.
              </div>
            ) : (
              locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <UserPlus className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {location.title}
                    </div>
                    <motion.button
                      onClick={() => handleVolunteerSignup(location.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Sign up for ${location.title}`}
                    >
                      Sign Up to Volunteer
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
