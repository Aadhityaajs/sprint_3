import React, { useEffect, useState } from "react";

/**
 * PropertyForm.jsx
 * - Normalizes (trim + collapse spaces) all string fields
 * - Strong validations as requested
 * - Replaces account number with UPI ID and validates it
 * - Country fixed to "India"
 * - State dropdown -> City dropdown dependent
 */

const INDIA_STATES_AND_CITIES = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Tirupati",
    "Nellore",
    "Kurnool",
    "Anantapur",
    "Rajahmundry",
    "Kakinada",
    "Eluru",
    "Ongole",
    "Chittoor",
  ],
  "Arunachal Pradesh": [
    "Itanagar",
    "Tawang",
    "Ziro",
    "Pasighat",
    "Naharlagun",
    "Bomdila",
    "Dirang",
    "Namsai",
    "Seppa",
    "Tezu",
    "Anini",
    "Bhalukpong",
  ],
  "Assam": [
    "Guwahati",
    "Dibrugarh",
    "Jorhat",
    "Silchar",
    "Tezpur",
    "Nagaon",
    "Bongaigaon",
    "Tinsukia",
    "Barpeta",
    "Diphu",
    "Sivasagar",
    "Karimganj",
  ],
  "Bihar": [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Darbhanga",
    "Purnia",
    "Munger",
    "Motihari (East Champaran)",
    "Buxar",
    "Chapra (Saran)",
    "Siwan",
    "Ara (Bhojpur)",
  ],
  "Chhattisgarh": [
    "Raipur",
    "Bilaspur",
    "Durg",
    "Korba",
    "Bhilai",
    "Jagdalpur",
    "Rajnandgaon",
    "Bastar (Jagdalpur region)",
    "Raigarh",
    "Mahasamund",
    "Ambikapur",
    "Kawardha",
  ],
  "Goa": [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Ponda",
    "Mapusa",
    "Bicholim",
    "Sanquelim",
    "Canacona (Chaudi)",
    "Calangute",
    "Dona Paula",
    "Verna",
    "Porvorim",
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Anand",
    "Porbandar",
    "Nadiad",
    "Surendranagar",
    "Bharuch",
  ],
  "Haryana": [
    "Gurugram",
    "Faridabad",
    "Ambala",
    "Panipat",
    "Karnal",
    "Yamunanagar",
    "Sonipat",
    "Hisar",
    "Rohtak",
    "Rewari",
    "Jind",
    "Panchkula",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Kangra",
    "Solan",
    "Mandi",
    "Bilaspur",
    "Hamirpur",
    "Una",
    "Kullu",
    "Chamba",
    "Nahan",
    "Sirmaur (Nahan region)",
  ],
  "Jharkhand": [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Hazaribagh",
    "Giridih",
    "Deoghar",
    "Daltonganj (Medininagar)",
    "Bokaro Steel City",
    "Jamtara",
    "Rourkela (nearby, Odisha but sometimes serviced)",
    "Chaibasa",
  ],
  "Karnataka": [
    "Bengaluru",
    "Mysuru",
    "Mangalore",
    "Hubballi-Dharwad",
    "Belgaum (Belagavi)",
    "Dharwad",
    "Ballari",
    "Davanagere",
    "Shimoga (Shivamogga)",
    "Udupi",
    "Tumkur (Tumakuru)",
    "Raichur",
  ],
  "Kerala": [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Kannur",
    "Alappuzha",
    "Kollam",
    "Palakkad",
    "Ponkunnam (Kanjirappally region)",
    "Kottayam",
    "Malappuram",
    "Vatakara",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Sagar",
    "Rewa",
    "Satna",
    "Ratlam",
    "Bhind",
    "Dewas",
    "Khandwa",
  ],
  "Maharashtra": [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Aurangabad",
    "Solapur",
    "Amravati",
    "Kolhapur",
    "Akola",
    "Nanded",
    "Kalyan-Dombivli",
  ],
  "Manipur": [
    "Imphal",
    "Thoubal",
    "Churachandpur",
    "Ukhrul",
    "Senapati",
    "Bishnupur",
    "Kakching",
    "Jiribam",
    "Chandel",
    "Tamenglong",
    "Noney",
    "Kamjong",
  ],
  "Meghalaya": [
    "Shillong",
    "Tura",
    "Nongstoin",
    "Nongpoh",
    "Williamnagar",
    "Jowai",
    "Baghmara",
    "Resubelpara",
    "Ampati",
    "Mawkyrwat",
    "Shillong Cantonment",
    "Ranikor",
  ],
  "Mizoram": [
    "Aizawl",
    "Lunglei",
    "Champhai",
    "Kolasib",
    "Serchhip",
    "Mamit",
    "Saiha (Chhimtuipui)",
    "Lawngtlai",
    "Saitual",
    "Khawzawl",
    "Hnahthial",
    "Vairengte",
  ],
  "Nagaland": [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Zunheboto",
    "Phek",
    "Mon",
    "Longleng",
    "Kiphire",
    "Atoizu",
    "Chumoukedima",
  ],
  "Odisha": [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Brahmapur (Berhampur)",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Barbil",
    "Jharsuguda",
    "Balangir",
    "Koraput",
    "Paradip",
  ],
  "Punjab": [
    "Amritsar",
    "Ludhiana",
    "Jalandhar",
    "Chandigarh",
    "Patiala",
    "Bathinda",
    "Mohali (SAS Nagar)",
    "Hoshiarpur",
    "Pathankot",
    "Firozpur",
    "Sangrur",
    "Moga",
  ],
  "Rajasthan": [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
    "Sikar",
    "Bharatpur",
    "Bhilwara",
    "Tonk",
    "Barmer",
  ],
  "Sikkim": [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Singtam",
    "Rhenock",
    "Soreng",
    "Pakyong",
    "Jorethang",
    "Rongli",
    "Rangpo",
    "Melli",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Tiruppur",
    "Vellore",
    "Thoothukudi (Tuticorin)",
    "Nagercoil",
    "Dindigul",
    "Kanchipuram",
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Mahbubnagar",
    "Suryapet",
    "Ramagundam",
    "Adilabad",
    "Medak",
    "Bhongir (Bhuvanagiri)",
    "Secunderabad",
  ],
  "Tripura": [
    "Agartala",
    "Udaipur",
    "Dharmanagar",
    "Kailasahar",
    "Belonia",
    "Sabroom",
    "Amarpur",
    "Khowai",
    "Kumarghat",
    "Jampuijala",
    "Charilam",
    "Teliamura",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Meerut",
    "Prayagraj (Allahabad)",
    "Ghaziabad",
    "Noida",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Gorakhpur",
  ],
  "Uttarakhand": [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Nainital",
    "Rudrapur",
    "Kashipur",
    "Pithoragarh",
    "Bageshwar",
    "Kotdwar",
    "Almora",
    "Tehri",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Siliguri",
    "Asansol",
    "Bardhaman",
    "Kharagpur",
    "Haldia",
    "Kalyani",
    "Berhampore (Murshidabad)",
    "Ranaghat",
    "Bally",
  ],
  // Union Territories (include several towns/cities per UT where possible)
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Rangat",
    "Neil Island",
    "Havelock Island (Swaraj Dweep)",
    "Mayabunder",
    "Diglipur",
    "Car Nicobar",
    "Little Andaman",
    "Wandoor",
    "Bambooflat",
    "Kadamtala",
    "Campbell Bay",
  ],
  "Chandigarh": [
    "Chandigarh",
    "Industrial Area Phase 1",
    "Industrial Area Phase 2",
    "Sector 17",
    "Sector 22",
    "Sector 35",
    "Sector 43",
    "Sector 8",
    "Sector 9",
    "Sector 11",
    "Sector 34",
    "Sector 44",
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
    "Nani Daman",
    "Moti Daman",
    "Khadia",
    "Vapi (nearby industrial town)",
    "Amal",
    "Kachigam",
    "Rajpipla",
    "Udvada",
    "Sanjan",
  ],
  "Delhi": [
    "New Delhi",
    "Connaught Place",
    "Karol Bagh",
    "Saket",
    "Dwarka",
    "Rohini",
    "Pitampura",
    "Lajpat Nagar",
    "Janakpuri",
    "Vasant Kunj",
    "East of Kailash",
    "Narela",
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Kupwara",
    "Udhampur",
    "Kathua",
    "Rajouri",
    "Kulgam",
    "Shopian",
    "Poonch",
    "Doda",
  ],
  "Ladakh": [
    "Leh",
    "Kargil",
    "Nubra",
    "Sakti (small settlements)",
    "Leh Market",
    "Diskit",
    "Tangtse",
    "Durbuk",
    "Padum",
    "Khaltsi",
    "Zanskar",
    "Hunder",
  ],
  "Lakshadweep": [
    "Kavaratti",
    "Agatti",
    "Minicoy",
    "Amini",
    "Kadmat",
    "Kiltan",
    "Andrott",
    "Kalpeni",
    "Bangaram",
    "Pitti",
    "Cheriyam",
    "Suheli",
  ],
  "Puducherry": [
    "Puducherry",
    "Ariyankuppam",
    "Karaikal",
    "Mahe",
    "Yanam",
    "Villianur",
    "Bahour",
    "Oulgaret",
    "Embalam",
    "Nettapakkam",
    "Thirukkanur",
    "Mudaliarpet",
  ],
};

export default function PropertyForm({
  initial,
  isEdit,
  userId,
  onCancel,
  onSubmit,
}) {
  // normalization helper: trim & collapse multiple spaces into one
  const normalize = (str = "") =>
    String(str)
      .replace(/\s+/g, " ")
      .trim();

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
    country: "India", // fixed
    postalCode: "",
    hasWifi: false,
    hasParking: false,
    hasPool: false,
    hasAc: false,
    hasHeater: false,
    hasPetFriendly: false,
    propertyStatus: isEdit ? "AVAILABLE" : "AVAILABLE",
    propertyUpiId: "",
  });

  const [errors, setErrors] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    // Keep country locked to India
    setForm((f) => ({ ...f, country: "India" }));
  }, []);

  useEffect(() => {
    if (initial) {
      setForm((prev) => ({
        ...prev,
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
        country: "India",
        postalCode: initial.postalCode || "",
        hasWifi: !!initial.hasWifi,
        hasParking: !!initial.hasParking,
        hasPool: !!initial.hasPool,
        hasAc: !!initial.hasAc,
        hasHeater: !!initial.hasHeater,
        hasPetFriendly: !!initial.hasPetFriendly,
        propertyStatus: initial.propertyStatus || "AVAILABLE",
        propertyUpiId: initial.propertyUpiId || "",
      }));
    }
  }, [initial, isEdit, userId]);

  // update availableCities when state changes
  useEffect(() => {
    const list = form.state ? INDIA_STATES_AND_CITIES[form.state] || [] : [];
    setAvailableCities(list);
    if (!list.includes(form.city)) {
      setForm((f) => ({ ...f, city: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state]);

  // UPI VPA regex (practical and permissive): username@handle
  // username: letters/numbers/dot/underscore/hyphen, 2-64 chars
  // handle: letters/numbers, at least 2-3 chars
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,64}$/;

  // URL regex (keeps earlier rule: must start with http/https)
  const urlRegex = /^(https?:\/\/)[^\s]+$/i;

  // Only letters and spaces for city/state/country? But we use dropdown for state/city and country fixed
  const alphaRegex = /^[A-Za-z\s]+$/;

  const normalizeAllFields = (raw) => {
    // For every string field, collapse spaces and trim
    const copy = { ...raw };

    [
      "propertyName",
      "propertyDescription",
      "imageURL",
      "buildingNo",
      "street",
      "city",
      "state",
      "country",
      "postalCode",
      "propertyUpiId",
    ].forEach((k) => {
      if (typeof copy[k] === "string") copy[k] = normalize(copy[k]);
    });

    return copy;
  };

  const validate = (rawForm) => {
    const f = normalizeAllFields(rawForm);
    const e = {};

    // propertyName: at least 3 letters (alphabetic characters), length check after normalization
    if (!f.propertyName || f.propertyName.length < 3) {
      e.propertyName = "Name must be at least 3 characters";
    } else {
      const letters = (f.propertyName.match(/[A-Za-z]/g) || []).length;
      if (letters < 3) e.propertyName = "Name must contain at least 3 letters";
    }

    // description: at least 20 chars
    if (!f.propertyDescription || f.propertyDescription.length < 20) {
      e.propertyDescription = "Description must be at least 20 characters";
    }

    // Rooms / Bathrooms / Max Guests: integer >= 1
    const intFields = [
      { key: "noOfRooms", label: "Rooms" },
      { key: "noOfBathrooms", label: "Bathrooms" },
      { key: "maxNoOfGuests", label: "Max Guests" },
    ];

    intFields.forEach(({ key, label }) => {
      const val = Number(f[key]);
      if (!Number.isFinite(val) || isNaN(val)) {
        e[key] = `${label} must be a number`;
      } else if (!Number.isInteger(val)) {
        e[key] = `${label} must be an integer`;
      } else if (val < 1) {
        e[key] = `${label} must be at least 1`;
      }
    });

    // pricePerDay: >= 100
    const price = Number(f.pricePerDay);
    if (!Number.isFinite(price) || isNaN(price)) {
      e.pricePerDay = "Price must be a number";
    } else if (price < 100) {
      e.pricePerDay = "Price must be at least 100";
    }

    // imageURL
    if (!f.imageURL || !urlRegex.test(f.imageURL)) {
      e.imageURL = "Enter a valid URL (must start with http/https)";
    }

    // UPI validation
    if (!f.propertyUpiId) {
      e.propertyUpiId = "UPI ID is required";
    } else if (!upiRegex.test(f.propertyUpiId)) {
      e.propertyUpiId =
        "Enter a valid UPI ID (example: name@bank). Allowed chars: letters, numbers, dot, hyphen, underscore.";
    }

    // buildingNo: cannot start with '-'
    if (typeof f.buildingNo === "string" && f.buildingNo.length > 0) {
      if (/^\-/.test(f.buildingNo)) {
        e.buildingNo = "Building No must not start with '-'";
      }
    } else {
      // optional? You used required fields, so mark required
      if (!f.buildingNo) e.buildingNo = "Building No is required";
    }

    // street: must start with letter or number
    if (!f.street) {
      e.street = "Street is required";
    } else if (!/^[A-Za-z0-9]/.test(f.street)) {
      e.street = "Street must start with a letter or number";
    }

    // state: must be one of the keys
    if (!f.state) {
      e.state = "State is required";
    } else if (!INDIA_STATES_AND_CITIES[f.state]) {
      e.state = "Select a valid state";
    }

    // city: must be from availableCities for selected state
    if (!f.city) {
      e.city = "City is required";
    } else {
      const cities = INDIA_STATES_AND_CITIES[f.state] || [];
      if (cities.length > 0 && !cities.includes(f.city)) {
        e.city = "Select a city from the list";
      }
    }

    // country: must remain "India"
    if (f.country !== "India") {
      e.country = "Country must be India";
    }

    // postal code: 6 digits
    if (!/^\d{6}$/.test(f.postalCode)) {
      e.postalCode = "Postal code must be 6 digits";
    }

    setErrors(e);
    return { ok: Object.keys(e).length === 0, normalized: f };
  };

  const submit = (ev) => {
    ev.preventDefault();

    const { ok, normalized } = validate(form);
    if (!ok) return;

    // Prepare payload with normalized fields and proper types
    const payload = {
      propertyId: normalized.propertyId,
      propertyName: normalized.propertyName,
      propertyDescription: normalized.propertyDescription,
      noOfRooms: Number(normalized.noOfRooms),
      noOfBathrooms: Number(normalized.noOfBathrooms),
      maxNoOfGuests: Number(normalized.maxNoOfGuests),
      pricePerDay: Number(normalized.pricePerDay),
      userId: Number(normalized.userId),
      imageURL: normalized.imageURL,
      address: {
        buildingNo: normalized.buildingNo,
        street: normalized.street,
        city: normalized.city,
        state: normalized.state,
        country: normalized.country,
        postalCode: normalized.postalCode,
      },
      hasWifi: !!normalized.hasWifi,
      hasParking: !!normalized.hasParking,
      hasPool: !!normalized.hasPool,
      hasAc: !!normalized.hasAc,
      hasHeater: !!normalized.hasHeater,
      hasPetFriendly: !!normalized.hasPetFriendly,
      propertyStatus: normalized.propertyStatus,
      propertyUpiId: normalized.propertyUpiId, // UPI ID as string
    };

    onSubmit(payload);
  };

  // small helper to show input errors
  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;

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
            <h3 className="text-lg font-medium text-slate-800">
              Basic Information
            </h3>

            <div>
              <label className="font-medium">Property Name *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.propertyName}
                onChange={(e) =>
                  setForm({ ...form, propertyName: e.target.value })
                }
                placeholder="e.g. Cozy 2BHK Grand"
              />
              <Err field="propertyName" />
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
              <Err field="propertyDescription" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-medium">Rooms *</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="w-full mt-1 p-2 border rounded"
                  value={form.noOfRooms}
                  onChange={(e) =>
                    setForm({ ...form, noOfRooms: e.target.value })
                  }
                />
                <Err field="noOfRooms" />
              </div>

              <div>
                <label className="font-medium">Bathrooms *</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="w-full mt-1 p-2 border rounded"
                  value={form.noOfBathrooms}
                  onChange={(e) =>
                    setForm({ ...form, noOfBathrooms: e.target.value })
                  }
                />
                <Err field="noOfBathrooms" />
              </div>

              <div>
                <label className="font-medium">Max Guests *</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="w-full mt-1 p-2 border rounded"
                  value={form.maxNoOfGuests}
                  onChange={(e) =>
                    setForm({ ...form, maxNoOfGuests: e.target.value })
                  }
                />
                <Err field="maxNoOfGuests" />
              </div>
            </div>

            <div>
              <label className="font-medium">Price Per Day (₹) *</label>
              <input
                type="number"
                min={100}
                step={1}
                className="w-full mt-1 p-2 border rounded"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
              />
              <Err field="pricePerDay" />
            </div>

            <div>
              <label className="font-medium">Image URL *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.imageURL}
                onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
              />
              <Err field="imageURL" />
            </div>

            <div>
              <label className="font-medium">UPI ID *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.propertyUpiId}
                onChange={(e) => setForm({ ...form, propertyUpiId: e.target.value })}
                placeholder="example: yourname@bank"
              />
              <Err field="propertyUpiId" />
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
                  onChange={(e) => setForm({ ...form, buildingNo: e.target.value })}
                />
                <Err field="buildingNo" />
              </div>

              <div>
                <label className="font-medium">Street *</label>
                <input
                  className="w-full mt-1 p-2 border rounded"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
                <Err field="street" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-medium">State *</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="">-- Select State --</option>
                  {Object.keys(INDIA_STATES_AND_CITIES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <Err field="state" />
              </div>

              <div>
                <label className="font-medium">City *</label>
                <select
                  disabled={!form.state || availableCities.length === 0}
                  className="w-full mt-1 p-2 border rounded disabled:opacity-60"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                >
                  <option value="">
                    {form.state ? "-- Select City --" : "Select state first"}
                  </option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Err field="city" />
              </div>

              <div>
                <label className="font-medium">Country *</label>
                <input
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  value={"India"}
                  disabled
                />
                <Err field="country" />
              </div>
            </div>

            <div>
              <label className="font-medium">Postal Code *</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                maxLength={6}
              />
              <Err field="postalCode" />
            </div>
          </div>

          {/* AMENITIES */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-800">Amenities</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasWifi}
                  onChange={(e) => setForm({ ...form, hasWifi: e.target.checked })}
                />
                📶 WiFi
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasParking}
                  onChange={(e) => setForm({ ...form, hasParking: e.target.checked })}
                />
                🅿️ Parking
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasPool}
                  onChange={(e) => setForm({ ...form, hasPool: e.target.checked })}
                />
                🏊 Pool
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasAc}
                  onChange={(e) => setForm({ ...form, hasAc: e.target.checked })}
                />
                ❄️ AC
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasHeater}
                  onChange={(e) => setForm({ ...form, hasHeater: e.target.checked })}
                />
                🔥 Heater
              </label>

              <label className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasPetFriendly}
                  onChange={(e) => setForm({ ...form, hasPetFriendly: e.target.checked })}
                />
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
