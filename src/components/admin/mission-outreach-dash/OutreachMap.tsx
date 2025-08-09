
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface OutreachMapProps {
  locations: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
  }[];
}

export default function OutreachMap({ locations }: OutreachMapProps) {
  // Default center if no locations are provided or if all locations have invalid coordinates
  const defaultCenter: [number, number] = [0, 0]; // Default to [0,0] or a more appropriate default for your context

  // Calculate the center of all locations
  const center = locations.length > 0
    ? [
        locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
        locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length,
      ] as [number, number]
    : defaultCenter;

  return (
    <MapContainer center={center} zoom={locations.length > 0 ? 5 : 2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.latitude, location.longitude]}>
          <Popup>
            <strong>{location.name}</strong>
            {location.description && <p>{location.description}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
