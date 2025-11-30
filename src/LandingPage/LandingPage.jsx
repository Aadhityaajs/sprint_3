import React, { useState } from 'react';
import { Search, MapPin, Star, Shield, Award, Users, Globe, CheckCircle, TrendingUp, Menu, X, ArrowRight, Home, Building, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SFlogo from '../SFlogo.png';



export default function SpaceFinders() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('1');
    const navigate = useNavigate();


    const categories = [
        { icon: <Home className="w-6 h-6" />, name: "Homes", count: "12,000+" },
        { icon: <Building className="w-6 h-6" />, name: "Apartments", count: "8,500+" },
        { icon: <Briefcase className="w-6 h-6" />, name: "Office Spaces", count: "3,200+" },
        { icon: <Globe className="w-6 h-6" />, name: "Unique Stays", count: "5,000+" }
    ];

    const benefits = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Verified Properties",
            description: "Every listing is thoroughly verified and meets our quality standards"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Best Price Guarantee",
            description: "We guarantee competitive pricing with transparent fees"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "24/7 Customer Support",
            description: "Our dedicated team is available around the clock to assist you"
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Secure Booking",
            description: "Your payments and personal information are always protected"
        }
    ];

    const stats = [
        { value: "1M+", label: "Active Listings" },
        { value: "20+", label: "States" },
        { value: "50M+", label: "Guest Arrivals" },
        { value: "4.8", label: "Average Rating" }
    ];

    const navigateToLogin = () => {
        navigate('/login')
    }

    const navigateToSignup = () => {
        navigate('/signup')
    }

    const focusOnSearch = () => {
        const element = document.getElementById("searchBar");
        element.scrollIntoView(true);
    }


    const getDateISTForCheckInMin = () => {
        const now = new Date();
        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, '0');
        const day = String(istDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getDateISTForCheckInMax = () => {
        const now = new Date();
        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        // Add 1 year properly
        istDate.setFullYear(istDate.getFullYear() + 1);

        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, '0');
        const day = String(istDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getDateISTForCheckOutMin = () => {
        const now = new Date();
        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        // Add 1 day properly
        istDate.setDate(istDate.getDate() + 1);

        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, '0');
        const day = String(istDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getDateISTForCheckOutMax = () => {
        const now = new Date();
        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        // Add 6 months (this is already correct, but remove the incorrect line at the end)
        istDate.setMonth(istDate.getMonth() + 6);

        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, '0');
        const day = String(istDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };


    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <div
                style={{
                    height: "100vh"
                }}>
                <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center space-x-3">
                                <img src={SFlogo} alt="Logo" className="w-13 h-13" />
                                <span className="text-2xl font-bold text-gray-900">SpaceFinders</span>
                            </div>

                            <div className="hidden md:flex items-center space-x-4">
                                <button
                                    className="px-5 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                    onClick={navigateToLogin}>
                                    Sign In
                                </button>
                                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    style={{ borderRadius: 12 }
                                    }
                                    onClick={navigateToSignup}
                                >
                                    Get Started
                                </button>
                            </div>

                            <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </nav>

                <div className='bg-gradient-to-b from-blue-200 to-white'
                    style={{
                        padding: "15vh"
                    }}>

                    {/* Hero Section */}
                    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-150 to-white" id="searchBar">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
                                    Find Your Perfect Space
                                </h1>
                                <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                    Discover and book verified properties worldwide for short-term stays, extended living, and remote work
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                                        <span className="font-medium">1M+ Listings</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 mr-2 text-yellow-500 fill-current" />
                                        <span className="font-medium">4.8 Average Rating</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Globe className="w-5 h-5 mr-2 text-blue-600" />
                                        <span className="font-medium">20+ States</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="max-w-6xl mx-auto bg-white rounded-2xl p-4 shadow-xl border border-gray-200" >
                                <div className="flex items-center gap-2 divide-x divide-gray-200">
                                    <div className="flex-1 px-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Where</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search destinations"
                                                value={searchLocation}
                                                onChange={(e) => setSearchLocation(e.target.value)}
                                                className="w-full pl-6 pr-2 py-1 border-0 focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Check-in</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) =>
                                                setCheckIn(e.target.value)
                                            }
                                            min={getDateISTForCheckInMin()}
                                            max={getDateISTForCheckInMax()}

                                            className="w-full px-2 py-1 border-0 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="px-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Check-out</label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={getDateISTForCheckOutMin()}
                                            max={getDateISTForCheckOutMax()}
                                            className="w-full px-2 py-1 border-0 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div className="px-2">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Guests</label>
                                        <input
                                            type='number'
                                            min={1}
                                            max={100}
                                            value={guests}
                                            onChange={(e) => setGuests(e.target.value)}
                                            className="w-full px-2 py-1 border-0 focus:outline-none text-sm bg-white"
                                        >
                                        </input>
                                    </div>
                                    <div className="pl-3">
                                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
                                            style={{ borderRadius: 10 }}
                                            onClick={() => navigate('/search')}
                                        >
                                            <Search className="w-5 h-5" />
                                            <span>Search</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                        <p className="text-lg text-gray-600">Find the perfect space for any occasion</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-gray-600 font-medium">{category.count} listings</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-blue-100 text-sm sm:text-base font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose SpaceFinders</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing a seamless, secure, and reliable booking experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 text-blue-600">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Find Your Next Space?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join millions of travelers and remote workers discovering their perfect space worldwide
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center justify-center space-x-2 shadow-lg"
                            onClick={focusOnSearch}
                        >
                            <span>Start Exploring</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            className="px-8 py-4 bg-white text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
                            onClick={navigateToLogin}
                        >
                            List Your Property
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">SpaceFinders</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Your trusted partner for finding and booking spaces worldwide.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Safety Information</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Cancellation Options</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Hosting</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">List Your Space</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Host Resources</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Community Forum</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Responsible Hosting</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm">
                        <p>© 2024 SpaceFinders, Inc. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 sm:mt-0">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}