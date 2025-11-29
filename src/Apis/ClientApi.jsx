import axios from "axios"

const BASE_URL = "http://localhost:8081/api/client/"



export const getAllProperties = async () => {
  try {
    console.log("Searching for properties")
    const response = await axios.get(BASE_URL + "properties");
    const properties = response?.data || [];
    // console.log(properties)

    // Map API response to expected shape
    const mappedProperties = properties.map((p) => ({
      id: p.propertyId,
      name: p.propertyName,
      location: p.address?.city || "",
      bathrooms: p.noOfBathroom,
      max_guests: p.maxNumberOfGuest,
      price: p.pricePreDay,
      image: p.imageUrl,
      amenities: [
        ...(p.hasWifi ? ["WiFi"] : []),
        ...(p.hasParking ? ["Parking"] : []),
        ...(p.hasPool ? ["Pool"] : []),
        ...(p.hasAC ? ["Air Conditioning"] : []),
        ...(p.hasHeater ? ["Heater"] : []),
        ...(p.hasPetFriendly ? ["Pet Friendly"] : [])
      ]
    }));
    console.log("mappedProperties: ", mappedProperties)
    return mappedProperties;
  } catch (err) {
    console.log("This is the error: ", err);
    return [];
  }
};

export const makePayments = async (formData) => {
  const data = {
    cardName: formData.cardName,
    cardNumber: formData.cardNumber,
    expiryDate: formData.expiryDate,
    cvv: formData.cvv
  }
  try {
    console.log(BASE_URL + "makePayment");
    console.log(data);
    const response = await axios.post(BASE_URL + "makePayment", data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log("Response Status: ", response.status);
    return response.status === 200;
  } catch (err) {
    console.log("This is the error: ", err);
    return false;
  }

}
