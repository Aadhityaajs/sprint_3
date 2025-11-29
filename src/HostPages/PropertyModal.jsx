import React from "react";

export default function PropertyModal({ property, onClose }) {
  if (!property) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute right-4 top-4 bg-white border rounded-full w-10 h-10 grid place-items-center">✕</button>

        <div className="h-64 overflow-hidden">
          <img src={property.imageURL || "/assets/placeholder-property.jpg"} alt={property.propertyName} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{property.propertyName}</h2>
              <div className="text-sm text-slate-500">{property.propertyStatus}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">Description</h3>
            <p className="text-slate-700 mt-2">{property.propertyDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold">Property Details</h4>
              <div className="mt-2 text-sm text-slate-700">
                <div><strong>Rooms:</strong> {property.noOfRooms}</div>
                <div><strong>Bathrooms:</strong> {property.noOfBathrooms}</div>
                <div><strong>Max Guests:</strong> {property.maxNoOfGuests}</div>
                <div><strong>Price:</strong> ₹{property.pricePerDay}/night</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold">Address</h4>
              <div className="mt-2 text-sm text-slate-700">
                {property.buildingNo}, {property.street}<br />
                {property.city}, {property.state} - {property.postalCode}<br />
                {property.country}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Amenities</h4>
            <div className="mt-2 flex gap-3 text-sm">
              <div>{property.hasWifi ? "✅ WiFi" : "❌ WiFi"}</div>
              <div>{property.hasParking ? "✅ Parking" : "❌ Parking"}</div>
              <div>{property.hasPool ? "✅ Pool" : "❌ Pool"}</div>
              <div>{property.hasAc ? "✅ AC" : "❌ AC"}</div>
              <div>{property.hasHeater ? "✅ Heater" : "❌ Heater"}</div>
              <div>{property.hasPetFriendly ? "✅ Pet Friendly" : "❌ Not Pet Friendly"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}