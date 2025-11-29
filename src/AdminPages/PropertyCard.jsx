import React, { useState } from "react";
// import "./PropertyCard.css";

// Helper function to format address
function formatAddress(address) {
  if (typeof address === 'object') {
    return `${address.city}, ${address.state}`;
  }
  return address || "Downtown Area";
}

function PropertyCard({ property, onDelete, canDelete = true, isDeleted = false }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    if (!canDelete) {
      alert('Cannot delete property: It has active or future bookings.');
      return;
    }
    if (isDeleted) {
      return; // Don't show dialog for deleted properties
    }
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(property.propertyId);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // Create amenities array based on property data
  // Map available amenities to display values
  const amenities = [];
  if (property.hasParking) amenities.push("Parking");
  if (property.hasPool) amenities.push("Sea View"); // Pool/Sea View
  if (property.hasWifi) amenities.push("WiFi");
  // Add Food amenity for properties with AC (representing full-service properties)
  if (property.hasAc) amenities.push("Food");

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="text-lg leading-none text-amber-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="text-lg leading-none text-amber-400 opacity-50">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-lg leading-none text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex flex-col h-full ${isDeleted ? 'opacity-75 border-2 border-red-300 hover:opacity-85' : ''}`}>
        <div className="w-full h-[200px] overflow-hidden bg-gray-100 relative">
          <img
            src={property.imageURL}
            alt={property.propertyName}
            className="w-full h-full object-cover"
          />
          {isDeleted && (
            <div className="absolute inset-0 bg-red-800/70 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-base font-extrabold uppercase tracking-widest shadow-md">DELETED</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 m-0 leading-tight">{property.propertyName}</h3>
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${property.propertyStatus === 'DELETED' ? 'bg-red-100 text-red-800 border border-red-300' :
              property.propertyStatus === 'BOOKED' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
              {property.propertyStatus}
            </span>
          </div>
          <p className="text-[13px] text-gray-500 m-0">
            {formatAddress(property.address)}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-200">
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Rooms:</span>
              <span className="text-base font-bold text-gray-900 mt-0.5">{property.noOfRooms}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Baths:</span>
              <span className="text-base font-bold text-gray-900 mt-0.5">{property.noOfBathrooms}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Balcony:</span>
              <span className="text-base font-bold text-gray-900 mt-0.5">{property.balconies || 1}</span>
            </div>
          </div>

          <div className="my-1">
            <h4 className="text-[13px] font-bold text-gray-700 m-0 mb-2 uppercase tracking-wide">Amenities</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {amenities.map((amenity, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-100 to-gray-200 px-2.5 py-2 rounded-md text-xs font-semibold text-gray-700 text-center border border-gray-300">
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-0.5">{renderStars(property.propertyRate)}</div>
            <span className="text-sm font-bold text-gray-700">
              {property.propertyRate?.toFixed(1) ?? '0.0'}
            </span>
          </div>

          <div className="flex items-center gap-2 py-2.5">
            <span className="text-[13px] text-gray-500 font-semibold">Price:</span>
            <span className="text-xl font-extrabold text-emerald-600">₹{property.pricePerDay}/day</span>
          </div>

          {!isDeleted && (
            <button
              className={`w-full p-3 bg-gradient-to-br from-red-500 to-red-600 text-white border-none rounded-lg font-bold text-sm cursor-pointer transition hover:from-red-600 hover:to-red-700 hover:-translate-y-px hover:shadow-md mt-auto ${!canDelete ? 'bg-gray-300 text-gray-400 cursor-not-allowed opacity-60 hover:transform-none hover:shadow-none' : ''}`}
              onClick={handleDeleteClick}
              disabled={!canDelete}
              title={!canDelete ? 'Cannot delete: Property has active bookings' : 'Delete this property'}
            >
              Delete Property
            </button>
          )}
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-[400px] w-[90%]">
            <h3 className="m-0 mb-3 text-xl text-gray-900">Confirm Deletion</h3>
            <p className="m-0 mb-5 text-gray-500 text-[15px]">Confirm you wanna delete this property?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-5 py-2.5 border-none rounded-lg font-bold text-sm cursor-pointer transition bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="px-5 py-2.5 border-none rounded-lg font-bold text-sm cursor-pointer transition bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyCard;
