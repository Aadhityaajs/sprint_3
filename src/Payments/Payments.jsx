import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, Check, CircleX } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CONSTANTS } from '../constants';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookingDetails, setBookingDetails] = useState(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cardCvv: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    // Check if there's a pending booking
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (!pendingBooking) {
      toast.error('No pending booking found');
      setTimeout(() => navigate('/search'), 1500);
    } else {
      try {
        const booking = JSON.parse(pendingBooking);
        setBookingDetails(booking);
      } catch (err) {
        console.error('Error parsing booking:', err);
        toast.error('Invalid booking data');
        setTimeout(() => navigate('/search'), 1500);
      }
    }
  }, [navigate]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value.replace(/\s/g, '').slice(0, 16));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value.slice(0, 5));
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : formattedValue
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberClean.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Invalid expiry date';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveBookingToDatabase = async (bookingPayload) => {
    try {
      const res = await fetch(`${CONSTANTS.API_BASE_URL}/api/client/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        let msg = 'Failed to save booking.';
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch (parseErr) {
          console.error('Could not parse error response:', parseErr);
        }
        throw new Error(msg);
      }

      const responseData = await res.json();
      return responseData;
    } catch (err) {
      console.error('Booking save error:', err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Payment successful - now save the booking
      const pendingBookingStr = sessionStorage.getItem('pendingBooking');
      if (!pendingBookingStr) {
        throw new Error('Booking data not found');
      }

      const bookingPayload = JSON.parse(pendingBookingStr);
      bookingPayload.isPaymentStatus = true;
      bookingPayload.paymentDate = new Date().toISOString();

      // Save booking to database
      await saveBookingToDatabase(bookingPayload);

      // Clear pending booking
      sessionStorage.removeItem('pendingBooking');

      setIsProcessing(false);
      setPaymentSuccess(true);

      // Redirect to bookings page after 3 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);

    } catch (err) {
      console.error('Payment/Booking error:', err);
      setIsProcessing(false);
      setPaymentFailed(true);
      toast.error(err.message || 'Payment failed');

      // Redirect back to property details after 3 seconds
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed</p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  if (paymentFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleX className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed!</h2>
          <p className="text-gray-600 mb-4">There was an issue processing your payment</p>
          <p className="text-sm text-gray-500">Redirecting back...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Calculate breakdown
  const nights = Math.ceil((new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24));
  const baseFare = bookingDetails.pricePerDay * nights;
  const deepCleanFee = bookingDetails.hasDeepClean ? CONSTANTS.CLEANING_FEE : 0;
  const totalAmount = bookingDetails.totalPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="grid md:grid-cols-2">
          {/* Left side - Order Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
            <h2 className="text-2xl font-bold mb-8">Booking Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-indigo-200">Base Fare</span>
                  <p className="text-xs text-indigo-300">₹{bookingDetails.pricePerDay} × {nights} night{nights > 1 ? 's' : ''}</p>
                </div>
                <span className="font-semibold">₹{baseFare}</span>
              </div>

              {bookingDetails.hasDeepClean && (
                <div className="flex justify-between">
                  <span className="text-indigo-200">Deep Cleaning</span>
                  <span className="font-semibold">₹{deepCleanFee}</span>
                </div>
              )}

              {bookingDetails.hasExtraCot && (
                <div className="flex justify-between">
                  <div>
                    <span className="text-indigo-200">Extra Cot</span>
                    <p className="text-xs text-indigo-300">Included</p>
                  </div>
                  <span className="font-semibold">₹0</span>
                </div>
              )}

              <div className="border-t border-indigo-400 pt-4 flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-semibold mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Check-in:</span>
                  <span>{bookingDetails.checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Check-out:</span>
                  <span>{bookingDetails.checkOutDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Guests:</span>
                  <span>{bookingDetails.numberOfGuest}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mt-4">
              <div className="flex items-center mb-2">
                <Lock className="w-5 h-5 mr-2" />
                <span className="font-semibold">Secure Payment</span>
              </div>
              <p className="text-sm text-indigo-100">Your payment information is encrypted and secure</p>
            </div>
          </div>

          {/* Right side - Payment Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.cardName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardName && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <CreditCard className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-white transition ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${totalAmount}`
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By completing this payment, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}