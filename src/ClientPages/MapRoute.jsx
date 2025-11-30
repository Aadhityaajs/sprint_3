import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit bounds
function FitBounds({ positions }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  
  return null;
}

export default function MapRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { propertyName, propertyLocation, latitude, longitude, address } = location.state || {};
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(userLocation);
          fetchRoute(userLocation, { lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your current location');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, [latitude, longitude]);

  const fetchRoute = async (start, end) => {
    try {
      // Using OSRM (Open Source Routing Machine) for routing
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoordinates(coordinates);
        
        // Calculate distance and duration
        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.round(route.duration / 60);
        setDistance(distanceKm);
        setDuration(durationMin);
      } else {
        // Fallback: straight line if routing fails
        setRouteCoordinates([[start.lat, start.lng], [end.lat, end.lng]]);
        toast.warning('Showing direct route. Detailed routing unavailable.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback: straight line
      setRouteCoordinates([[start.lat, start.lng], [end.lat, end.lng]]);
      toast.error('Could not fetch route details');
      setLoading(false);
    }
  };

  if (!latitude || !longitude) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Not Available</h2>
          <p className="text-gray-600 mb-6">Property coordinates are not available.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !currentLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading route...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            ← Back
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{propertyName}</h1>
            <p className="text-gray-600">{propertyLocation}</p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Route Info */}
      {distance && duration && (
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-center gap-8">
            <div className="text-center">
              <p className="text-sm">Distance</p>
              <p className="text-xl font-bold">{distance} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm">Duration</p>
              <p className="text-xl font-bold">{duration} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-[calc(100vh-180px)] w-full">
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Starting point (current location) */}
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={startIcon}>
            <Popup>
              <strong>Your Location</strong>
              <br />
              Starting point
            </Popup>
          </Marker>
          
          {/* Destination (property) */}
          <Marker position={[latitude, longitude]} icon={endIcon}>
            <Popup>
              <strong>{propertyName}</strong>
              <br />
              {propertyLocation}
              {address && address.street && (
                <>
                  <br />
                  {address.street}, {address.city}
                </>
              )}
            </Popup>
          </Marker>
          
          {/* Route line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              color="blue"
              weight={4}
              opacity={0.7}
            />
          )}
          
          {/* Fit bounds */}
          <FitBounds positions={routeCoordinates} />
        </MapContainer>
      </div>
    </div>
  );
}