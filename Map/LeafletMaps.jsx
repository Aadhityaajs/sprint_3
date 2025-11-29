// import React, { useEffect, useRef, useState } from 'react';
// import { MapPin, Search } from 'lucide-react';

// export default function MapComponent() {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markerRef = useRef(null);
  
//   const [lat, setLat] = useState('28.6139');
//   const [lng, setLng] = useState('77.2090');
//   const [tempLat, setTempLat] = useState('28.6139');
//   const [tempLng, setTempLng] = useState('77.2090');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Initialize map only once
//     if (!mapInstanceRef.current && mapRef.current) {
//       mapInstanceRef.current = L.map(mapRef.current).setView([parseFloat(lat), parseFloat(lng)], 13);

//       // Add OpenStreetMap tiles
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19
//       }).addTo(mapInstanceRef.current);

//       // Add initial marker
//       markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)])
//         .addTo(mapInstanceRef.current)
//         .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
//         .openPopup();
//     }

//     return () => {
//       // Cleanup map on unmount
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []);

//   const updateMap = () => {
//     const newLat = parseFloat(tempLat);
//     const newLng = parseFloat(tempLng);

//     if (isNaN(newLat) || isNaN(newLng)) {
//       alert('Please enter valid latitude and longitude values');
//       return;
//     }

//     if (newLat < -90 || newLat > 90) {
//       alert('Latitude must be between -90 and 90');
//       return;
//     }

//     if (newLng < -180 || newLng > 180) {
//       alert('Longitude must be between -180 and 180');
//       return;
//     }

//     setLat(tempLat);
//     setLng(tempLng);

//     if (mapInstanceRef.current) {
//       // Update map view
//       mapInstanceRef.current.setView([newLat, newLng], 13);

//       // Remove old marker and add new one
//       if (markerRef.current) {
//         mapInstanceRef.current.removeLayer(markerRef.current);
//       }

//       markerRef.current = L.marker([newLat, newLng])
//         .addTo(mapInstanceRef.current)
//         .bindPopup(`Lat: ${tempLat}, Lng: ${tempLng}`)
//         .openPopup();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       updateMap();
//     }
//   };

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       alert('Geolocation is not supported by your browser');
//       return;
//     }

//     setLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const currentLat = position.coords.latitude.toFixed(6);
//         const currentLng = position.coords.longitude.toFixed(6);
        
//         setTempLat(currentLat);
//         setTempLng(currentLng);
//         setLat(currentLat);
//         setLng(currentLng);

//         if (mapInstanceRef.current) {
//           mapInstanceRef.current.setView([parseFloat(currentLat), parseFloat(currentLng)], 13);

//           if (markerRef.current) {
//             mapInstanceRef.current.removeLayer(markerRef.current);
//           }

//           markerRef.current = L.marker([parseFloat(currentLat), parseFloat(currentLng)])
//             .addTo(mapInstanceRef.current)
//             .bindPopup(`Your Location<br>Lat: ${currentLat}, Lng: ${currentLng}`)
//             .openPopup();
//         }

//         setLoading(false);
//       },
//       (error) => {
//         setLoading(false);
//         let errorMessage = 'Unable to retrieve your location';
        
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = 'Location information is unavailable.';
//             break;
//           case error.TIMEOUT:
//             errorMessage = 'Location request timed out.';
//             break;
//         }
        
//         alert(errorMessage);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//       }
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-slate-800 mb-2">Interactive Map Viewer</h1>
//           <p className="text-slate-600">Enter coordinates to view location on map</p>
//         </div>

//         {/* Input Controls */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//           <div className="grid md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Latitude
//               </label>
//               <input
//                 type="number"
//                 step="any"
//                 value={tempLat}
//                 onChange={(e) => setTempLat(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter latitude (-90 to 90)"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Longitude
//               </label>
//               <input
//                 type="number"
//                 step="any"
//                 value={tempLng}
//                 onChange={(e) => setTempLng(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter longitude (-180 to 180)"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={updateMap}
//                 className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <Search className="w-5 h-5" />
//                 Update Location
//               </button>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={getCurrentLocation}
//                 disabled={loading}
//                 className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Getting...
//                   </>
//                 ) : (
//                   <>
//                     <MapPin className="w-5 h-5" />
//                     My Location
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Current Location Display */}
//           <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
//             <MapPin className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm text-slate-600">Current Location:</p>
//               <p className="font-semibold text-slate-800">
//                 {lat}, {lng}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Map Container */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div 
//             ref={mapRef} 
//             className="w-full h-[600px]"
//             style={{ zIndex: 0 }}
//           />
//         </div>

//         {/* Quick Location Examples */}
//         <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Locations</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <button
//               onClick={() => {
//                 setTempLat('28.6139');
//                 setTempLng('77.2090');
//                 setTimeout(updateMap, 100);
//               }}
//               className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
//             >
//               🇮🇳 New Delhi
//             </button>
//             <button
//               onClick={() => {
//                 setTempLat('40.7128');
//                 setTempLng('-74.0060');
//                 setTimeout(updateMap, 100);
//               }}
//               className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
//             >
//               🗽 New York
//             </button>
//             <button
//               onClick={() => {
//                 setTempLat('51.5074');
//                 setTempLng('-0.1278');
//                 setTimeout(updateMap, 100);
//               }}
//               className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
//             >
//               🇬🇧 London
//             </button>
//             <button
//               onClick={() => {
//                 setTempLat('35.6762');
//                 setTempLng('139.6503');
//                 setTimeout(updateMap, 100);
//               }}
//               className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
//             >
//               🇯🇵 Tokyo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Navigation, X } from 'lucide-react';

export default function MapComponent() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const routingControlRef = useRef(null);
  
  const [lat, setLat] = useState('28.6139');
  const [lng, setLng] = useState('77.2090');
  const [tempLat, setTempLat] = useState('28.6139');
  const [tempLng, setTempLng] = useState('77.2090');
  const [loading, setLoading] = useState(false);
  const [routeMode, setRouteMode] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([parseFloat(lat), parseFloat(lng)], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Add initial marker
      markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)])
        .addTo(mapInstanceRef.current)
        .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
        .openPopup();
    }

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateMap = () => {
    const newLat = parseFloat(tempLat);
    const newLng = parseFloat(tempLng);

    if (isNaN(newLat) || isNaN(newLng)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }

    if (newLat < -90 || newLat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (newLng < -180 || newLng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    setLat(tempLat);
    setLng(tempLng);

    if (mapInstanceRef.current) {
      // Update map view
      mapInstanceRef.current.setView([newLat, newLng], 13);

      // Remove old marker and add new one
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker([newLat, newLng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`Lat: ${tempLat}, Lng: ${tempLng}`)
        .openPopup();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateMap();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude.toFixed(6);
        const currentLng = position.coords.longitude.toFixed(6);
        
        setTempLat(currentLat);
        setTempLng(currentLng);
        setLat(currentLat);
        setLng(currentLng);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([parseFloat(currentLat), parseFloat(currentLng)], 13);

          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          markerRef.current = L.marker([parseFloat(currentLat), parseFloat(currentLng)])
            .addTo(mapInstanceRef.current)
            .bindPopup(`Your Location<br>Lat: ${currentLat}, Lng: ${currentLng}`)
            .openPopup();
        }

        setLoading(false);
      },
      (error) => {
        setLoading(false);
        let errorMessage = 'Unable to retrieve your location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const enableRouteMode = () => {
    setRouteMode(true);
    setStartPoint(null);
    setEndPoint(null);
    
    // Clear existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Add click handler to map
    mapInstanceRef.current.on('click', handleMapClick);
  };

  const handleMapClick = (e) => {
    setStartPoint(prevStart => {
      setEndPoint(prevEnd => {
        if (!prevStart) {
          // Set start point
          L.marker([e.latlng.lat, e.latlng.lng], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: "<div style='background-color:#22c55e;width:30px;height:30px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;'>A</div>",
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          }).addTo(mapInstanceRef.current).bindPopup('Start Point').openPopup();
          return prevEnd;
        } else if (!prevEnd) {
          // Set end point
          const endLatLng = [e.latlng.lat, e.latlng.lng];
          L.marker(endLatLng, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: "<div style='background-color:#ef4444;width:30px;height:30px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;'>B</div>",
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          }).addTo(mapInstanceRef.current).bindPopup('End Point').openPopup();

          // Calculate route with current start point
          calculateRouteWithPoints(prevStart, endLatLng);
          
          return endLatLng;
        }
        return prevEnd;
      });
      
      if (!prevStart) {
        return [e.latlng.lat, e.latlng.lng];
      }
      return prevStart;
    });
  };

  const calculateRouteWithPoints = async (start, end) => {
    if (!start || !end) return;

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Draw route on map
        if (routingControlRef.current) {
          mapInstanceRef.current.removeLayer(routingControlRef.current);
        }

        routingControlRef.current = L.polyline(coordinates, {
          color: '#3b82f6',
          weight: 5,
          opacity: 0.7
        }).addTo(mapInstanceRef.current);

        // Fit map to show entire route
        mapInstanceRef.current.fitBounds(routingControlRef.current.getBounds());

        // Show route info
        const distance = (route.distance / 1000).toFixed(2);
        const duration = Math.round(route.duration / 60);
        
        L.popup()
          .setLatLng(end)
          .setContent(`<b>Route Info</b><br>Distance: ${distance} km<br>Duration: ${duration} mins`)
          .openOn(mapInstanceRef.current);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    }
  };



  const clearRoute = () => {
    setRouteMode(false);
    setStartPoint(null);
    setEndPoint(null);

    // Remove click handler
    mapInstanceRef.current.off('click', handleMapClick);

    // Clear route and markers
    if (routingControlRef.current) {
      mapInstanceRef.current.removeLayer(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Clear all markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Interactive Map Viewer</h1>
          <p className="text-slate-600">Enter coordinates to view location or create navigation routes</p>
        </div>

        {/* Input Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={tempLat}
                onChange={(e) => setTempLat(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter latitude (-90 to 90)"
                disabled={routeMode}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={tempLng}
                onChange={(e) => setTempLng(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter longitude (-180 to 180)"
                disabled={routeMode}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={updateMap}
                disabled={routeMode}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                Update Location
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={getCurrentLocation}
                disabled={loading || routeMode}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Getting...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    My Location
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex gap-3">
              {!routeMode ? (
                <button
                  onClick={enableRouteMode}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  Create Navigation Route
                </button>
              ) : (
                <>
                  <div className="flex-1 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
                      {!startPoint ? '📍 Click on map to set START point' : 
                       !endPoint ? '📍 Click on map to set END point' : 
                       '✅ Route calculated!'}
                    </p>
                  </div>
                  <button
                    onClick={clearRoute}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <X className="w-5 h-5" />
                    Clear Route
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Current Location Display */}
          {!routeMode && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Current Location:</p>
                <p className="font-semibold text-slate-800">
                  {lat}, {lng}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-[600px]"
            style={{ zIndex: 0 }}
          />
        </div>

        {/* Quick Location Examples */}
        {!routeMode && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Locations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setTempLat('28.6139');
                  setTempLng('77.2090');
                  setTimeout(updateMap, 100);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
              >
                🇮🇳 New Delhi
              </button>
              <button
                onClick={() => {
                  setTempLat('40.7128');
                  setTempLng('-74.0060');
                  setTimeout(updateMap, 100);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
              >
                🗽 New York
              </button>
              <button
                onClick={() => {
                  setTempLat('51.5074');
                  setTempLng('-0.1278');
                  setTimeout(updateMap, 100);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
              >
                🇬🇧 London
              </button>
              <button
                onClick={() => {
                  setTempLat('35.6762');
                  setTempLng('139.6503');
                  setTimeout(updateMap, 100);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
              >
                🇯🇵 Tokyo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}