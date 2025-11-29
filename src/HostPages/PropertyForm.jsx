import React, { useEffect, useState } from "react";

export default function PropertyForm({ initial, isEdit, userId, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    propertyId: 0,
    propertyName: "",
    propertyDescription: "",
    noOfRooms: 1,
    noOfBathrooms: 1,
    maxNoOfGuests: 1,
    pricePerDay: 100,
    userId: userId,
    imageURL: "",
    buildingNo: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    hasWifi: false,
    hasParking: false,
    hasPool: false,
    hasAc: false,
    hasHeater: false,
    hasPetFriendly: false,
    propertyStatus: isEdit ? "AVAILABLE" : "AVAILABLE",
    propertyAccountNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        propertyId: initial.propertyId || 0,
        propertyName: initial.propertyName || "",
        propertyDescription: initial.propertyDescription || "",
        noOfRooms: initial.noOfRooms || 1,
        noOfBathrooms: initial.noOfBathrooms || 1,
        maxNoOfGuests: initial.maxNoOfGuests || 1,
        pricePerDay: initial.pricePerDay || 100,
        userId: initial.hostId || userId,
        imageURL: initial.imageURL || "",
        buildingNo: initial.buildingNo || "",
        street: initial.street || "",
        city: initial.city || "",
        state: initial.state || "",
        country: initial.country || "",
        postalCode: initial.postalCode || "",
        hasWifi: !!initial.hasWifi,
        hasParking: !!initial.hasParking,
        hasPool: !!initial.hasPool,
        hasAc: !!initial.hasAc,
        hasHeater: !!initial.hasHeater,
        hasPetFriendly: !!initial.hasPetFriendly,
        propertyStatus: initial.propertyStatus || "AVAILABLE",
        propertyAccountNumber: initial.propertyAccountNumber || "",
      });
    }
  }, [initial, isEdit, userId]);

  // VALIDATION
  const validate = () => {
    const e = {};

    if (!form.propertyName || form.propertyName.length < 5)
      e.propertyName = "Name must be at least 5 characters";

    if (!form.propertyDescription || form.propertyDescription.length < 20)
      e.propertyDescription = "Description must be at least 20 characters";

    if (form.pricePerDay < 100)
      e.pricePerDay = "Price must be at least 100";

    // Only alphabets for city/state/country
    const alphaRegex = /^[A-Za-z\s]+$/;

    if (!alphaRegex.test(form.city)) e.city = "City must contain only letters";
    if (!alphaRegex.test(form.state)) e.state = "State must contain only letters";
    if (!alphaRegex.test(form.country)) e.country = "Country must contain only letters";

    // Postal code
    if (!/^\d{6}$/.test(form.postalCode))
      e.postalCode = "Postal code must be 6 digits";

    // URL validation
    const urlRegex = /^(https?:\/\/)[^\s]+$/;
    if (!urlRegex.test(form.imageURL))
      e.imageURL = "Enter a valid URL (must start with http/https)";

    const accountRegex = /^[0-9]{10,18}$/;
    if (!accountRegex.test(form.propertyAccountNumber)) {
      e.propertyAccountNumber = "Account number must be 10 to 18 digits";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      propertyId: form.propertyId,
      propertyName: form.propertyName,
      propertyDescription: form.propertyDescription,
      noOfRooms: Number(form.noOfRooms),
      noOfBathrooms: Number(form.noOfBathrooms),
      maxNoOfGuests: Number(form.maxNoOfGuests),
      pricePerDay: Number(form.pricePerDay),
      userId: Number(form.userId),
      imageURL: form.imageURL,
      address: {
        buildingNo: form.buildingNo,
        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
        postalCode: form.postalCode,
      },
      hasWifi: !!form.hasWifi,
      hasParking: !!form.hasParking,
      hasPool: !!form.hasPool,
      hasAc: !!form.hasAc,
      hasHeater: !!form.hasHeater,
      hasPetFriendly: !!form.hasPetFriendly,
      propertyStatus: form.propertyStatus,
      propertyAccountNumber: Number(form.propertyAccountNumber),
    };
    console.log("Submitting property:", payload);

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[95vh]">

        {/* CLOSE BUTTON */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-slate-500 text-xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {isEdit ? "Edit Property" : "Add New Property"}
        </h2>

        <form onSubmit={submit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-medium text-slate-800">Basic Information</h3>

            <div>
              <label className="font-medium">Property Name *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.propertyName}
                onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
              />
              {errors.propertyName && (
                <p className="text-red-600 text-sm">{errors.propertyName}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Description *</label>
              <textarea
                rows={4}
                className="w-full mt-1 p-2 border rounded"
                value={form.propertyDescription}
                onChange={(e) =>
                  setForm({ ...form, propertyDescription: e.target.value })
                }
              />
              {errors.propertyDescription && (
                <p className="text-red-600 text-sm">{errors.propertyDescription}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Rooms *</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={form.noOfRooms}
                  onChange={(e) =>
                    setForm({ ...form, noOfRooms: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Bathrooms *</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={form.noOfBathrooms}
                  onChange={(e) =>
                    setForm({ ...form, noOfBathrooms: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Max Guests *</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={form.maxNoOfGuests}
                  onChange={(e) =>
                    setForm({ ...form, maxNoOfGuests: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Price Per Day (₹) *</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                value={form.pricePerDay}
                onChange={(e) =>
                  setForm({ ...form, pricePerDay: e.target.value })
                }
              />
              {errors.pricePerDay && (
                <p className="text-red-600 text-sm">{errors.pricePerDay}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Image URL *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.imageURL}
                onChange={(e) =>
                  setForm({ ...form, imageURL: e.target.value })
                }
              />
              {errors.imageURL && (
                <p className="text-red-600 text-sm">{errors.imageURL}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Account Number *</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                value={form.propertyAccountNumber}
                onChange={(e) =>
                  setForm({ ...form, propertyAccountNumber: e.target.value })
                }
              />
              {errors.propertyAccountNumber && (
                <div className="text-red-600 text-sm">{errors.propertyAccountNumber}</div>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-medium text-slate-800">Address</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Building No *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.buildingNo}
                  onChange={(e) =>
                    setForm({ ...form, buildingNo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium">Street *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.street}
                  onChange={(e) =>
                    setForm({ ...form, street: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-medium">City *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />
                {errors.city && (
                  <p className="text-red-600 text-sm">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="font-medium">State *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                />
                {errors.state && (
                  <p className="text-red-600 text-sm">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="font-medium">Country *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
                {errors.country && (
                  <p className="text-red-600 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            <div>
              <label className="font-medium">Postal Code *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
              {errors.postalCode && (
                <p className="text-red-600 text-sm">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* AMENITIES WITH EMOJIS */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-800">Amenities</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasWifi}
                  onChange={(e) => setForm({ ...form, hasWifi: e.target.checked })} />
                📶 WiFi
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasParking}
                  onChange={(e) => setForm({ ...form, hasParking: e.target.checked })} />
                🅿️ Parking
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasPool}
                  onChange={(e) => setForm({ ...form, hasPool: e.target.checked })} />
                🏊 Pool
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasAc}
                  onChange={(e) => setForm({ ...form, hasAc: e.target.checked })} />
                ❄️ AC
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasHeater}
                  onChange={(e) => setForm({ ...form, hasHeater: e.target.checked })} />
                🔥 Heater
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input type="checkbox" checked={form.hasPetFriendly}
                  onChange={(e) =>
                    setForm({ ...form, hasPetFriendly: e.target.checked })
                  } />
                🐕 Pet Friendly
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#1976D2] text-white rounded hover:bg-blue-700"
            >
              {isEdit ? "Update Property" : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
