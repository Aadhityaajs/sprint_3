import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { computeStatus } from "../utils/dateHelpers";
import { MapPin, Navigation, Route, X } from "lucide-react";

export default function BookingDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const { booking } = state || {};

  useEffect(() => {
    if (!booking || !mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      const L = window.L;
      const map = L.map(mapRef.current).setView([booking.latitude || 20.5937, booking.longitude || 78.9629], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add property marker with default Leaflet icon (red)
      const propertyIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([booking.latitude || 20.5937, booking.longitude || 78.9629], { icon: propertyIcon })
        .addTo(map)
        .bindPopup(`<b>${booking.name}</b><br>${booking.location}`)
        .openPopup();

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [booking]);

  const getDirectionIcon = (type, modifier) => {
    // Map instruction types to simple symbols
    const icons = {
      'turn': modifier?.includes('left') ? '↰' : '↱',
      'new name': '→',
      'depart': '▶',
      'arrive': '🏁',
      'merge': '⤴',
      'on ramp': '↗',
      'off ramp': '↘',
      'fork': '⑂',
      'end of road': '⊣',
      'continue': '↑',
      'roundabout': '⟲',
      'rotary': '⟲',
      'exit roundabout': '↗'
    };
    return icons[type] || '→';
  };

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setLocationError("");
    setRouteInstructions([]);
    setRouteInfo(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        if (mapInstanceRef.current && booking) {
          const L = window.L;
          const map = mapInstanceRef.current;

          // Remove previous user marker and route if exists
          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }
          if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
          }

          // Add user location marker with custom styling
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `
              <div style="
                width: 30px;
                height: 30px;
                background-color: #2563eb;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 10px;
                  height: 10px;
                  background-color: white;
                  border-radius: 50%;
                "></div>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          });

          const userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>Your Location</b>");
          
          userMarkerRef.current = userMarker;

          const propertyLat = booking.latitude || 20.5937;
          const propertyLng = booking.longitude || 78.9629;

          try {
            // Fetch route from OSRM API
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${propertyLng},${propertyLat}?overview=full&geometries=geojson&steps=true`;
            
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

              // Draw route on map
              const routeLayer = L.polyline(coordinates, {
                color: '#2563eb',
                weight: 5,
                opacity: 0.8
              }).addTo(map);

              routeLayerRef.current = routeLayer;

              // Fit map to show entire route
              map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

              // Extract turn-by-turn instructions
              const instructions = [];
              route.legs.forEach((leg, legIndex) => {
                leg.steps.forEach((step, stepIndex) => {
                  instructions.push({
                    instruction: step.maneuver.instruction || `Continue on ${step.name || 'the road'}`,
                    distance: (step.distance / 1000).toFixed(2), // Convert to km
                    duration: Math.round(step.duration / 60), // Convert to minutes
                    type: step.maneuver.type,
                    modifier: step.maneuver.modifier
                  });
                });
              });

              setRouteInstructions(instructions);
              setRouteInfo({
                distance: (route.distance / 1000).toFixed(2),
                duration: Math.round(route.duration / 60)
              });
              setShowDirections(true);

            } else {
              // Fallback to straight line if routing fails
              const straightLine = L.polyline(
                [[userLat, userLng], [propertyLat, propertyLng]],
                {
                  color: '#2563eb',
                  weight: 3,
                  opacity: 0.7,
                  dashArray: '10, 5'
                }
              ).addTo(map);

              routeLayerRef.current = straightLine;

              const bounds = L.latLngBounds([[userLat, userLng], [propertyLat, propertyLng]]);
              map.fitBounds(bounds, { padding: [50, 50] });

              const distance = map.distance([userLat, userLng], [propertyLat, propertyLng]);
              setRouteInfo({
                distance: (distance / 1000).toFixed(2),
                duration: 'N/A'
              });
            }

            setLoadingLocation(false);

          } catch (error) {
            console.error('Routing error:', error);
            setLocationError('Failed to fetch route. Showing straight line distance.');
            
            // Fallback to straight line
            const straightLine = L.polyline(
              [[userLat, userLng], [propertyLat, propertyLng]],
              {
                color: '#2563eb',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 5'
              }
            ).addTo(map);

            routeLayerRef.current = straightLine;

            const bounds = L.latLngBounds([[userLat, userLng], [propertyLat, propertyLng]]);
            map.fitBounds(bounds, { padding: [50, 50] });

            const distance = map.distance([userLat, userLng], [propertyLat, propertyLng]);
            setRouteInfo({
              distance: (distance / 1000).toFixed(2),
              duration: 'N/A'
            });

            setLoadingLocation(false);
          }
        }
      },
      (error) => {
        setLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
      }
    );
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Booking Found</h2>
          <p className="text-gray-600 mb-6">Please select a booking to view details.</p>
          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const addr = booking.address || {};
  const status = booking.status || computeStatus(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-5">
      <div className="max-w-6xl mx-auto">
        <button
          className="bg-gray-900 text-white border-none px-4 py-2 rounded-lg cursor-pointer mb-5 hover:bg-gray-800 transition-colors font-medium"
          onClick={() => navigate("/bookings")}
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Image */}
          <div>
            <img
              src={booking.image}
              alt={booking.name}
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Booking Information */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{booking.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{booking.location}</p>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Booking ID:</strong>
                <span>{booking.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Property ID:</strong>
                <span>{booking.propertyId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Check-in:</strong>
                <span>{booking.checkIn}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Check-out:</strong>
                <span>{booking.checkOut}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Nights:</strong>
                <span>{booking.nights}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Guests:</strong>
                <span>{booking.guests}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <strong>Status:</strong>
                <span
                  className={`font-bold ${
                    status === "CURRENT"
                      ? "text-green-600"
                      : status === "UPCOMING"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Price Per Day:</span>
                  <span className="font-semibold">₹{booking.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Has Extra Cot:</span>
                  <span>{booking.hasExtraCot ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deep Cleaning:</span>
                  <span>{booking.hasDeepClean ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Paid:</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {addr && (addr.buildingNo || addr.street || addr.city) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Property Address</h3>
                <p className="text-gray-700">
                  {addr.buildingNo && `${addr.buildingNo}, `}
                  {addr.street && `${addr.street}, `}
                  {addr.city && `${addr.city}, `}
                  {addr.state && `${addr.state}, `}
                  {addr.country && addr.country}
                  {addr.pincode && ` - ${addr.pincode}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Property Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            {booking.rooms && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.rooms}</p>
                <p className="text-sm">Rooms</p>
              </div>
            )}
            {booking.bathrooms && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.bathrooms}</p>
                <p className="text-sm">Bathrooms</p>
              </div>
            )}
            {booking.max_guests && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{booking.max_guests}</p>
                <p className="text-sm">Max Guests</p>
              </div>
            )}
            {booking.propertyStatus && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{booking.propertyStatus}</p>
                <p className="text-sm">Status</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Property Location & Navigation
            </h3>
            <button
              onClick={getUserLocation}
              disabled={loadingLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                loadingLocation
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Navigation className="w-4 h-4" />
              {loadingLocation ? "Getting Route..." : "Get Directions"}
            </button>
          </div>

          {locationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {locationError}
            </div>
          )}

          {routeInfo && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">{routeInfo.distance} km</p>
                    <p className="text-xs text-blue-700">Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">{routeInfo.duration} min</p>
                    <p className="text-xs text-blue-700">Duration</p>
                  </div>
                </div>
                {routeInstructions.length > 0 && (
                  <button
                    onClick={() => setShowDirections(!showDirections)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    <Route className="w-4 h-4" />
                    {showDirections ? 'Hide' : 'Show'} Directions
                  </button>
                )}
              </div>
            </div>
          )}

          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-gray-300 mb-4"
            style={{ minHeight: "400px" }}
          />

          {booking.latitude && booking.longitude && (
            <div className="text-sm text-gray-600">
              <p>
                <strong>Coordinates:</strong> {booking.latitude.toFixed(6)}, {booking.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Turn-by-Turn Directions Panel */}
        {showDirections && routeInstructions.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Route className="w-5 h-5 text-blue-600" />
                Turn-by-Turn Directions
              </h3>
              <button
                onClick={() => setShowDirections(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {routeInstructions.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getDirectionIcon(step.type, step.modifier)}</span>
                      <p className="text-gray-900 font-medium">{step.instruction}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-600">
                      <span>📏 {step.distance} km</span>
                      {step.duration > 0 && <span>⏱️ {step.duration} min</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-500">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  🏁
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-bold">You have arrived at {booking.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}