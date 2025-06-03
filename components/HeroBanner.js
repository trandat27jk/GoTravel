// app/components/HeroBanner.js
"use client";
import 'react-datepicker/dist/react-datepicker.css'; // Still needed if you use DatePicker elsewhere or for styling
import { useState, useEffect, useRef } from 'react';
// import DatePicker from 'react-datepicker'; // Removed DatePicker
import { FaSearch, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'; // Changed FaCalendarAlt to FaClock

import supabase from '../utils/supabase/client'; // Adjust path as needed

export default function HeroBanner() {
  // const [dateRange, setDateRange] = useState([null, null]); // Removed date state
  // const [startDate, endDate] = dateRange; // Removed date state

  const [destinationInput, setDestinationInput] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null); // Ref for destination suggestions dropdown

  // States for Group Size selection
  const [showGroupSizeDropdown, setShowGroupSizeDropdown] = useState(false);
  const [selectedGroupSizes, setSelectedGroupSizes] = useState([]);
  const groupSizeDropdownRef = useRef(null);

  // New states for Duration selection
  const [selectedDurationKey, setSelectedDurationKey] = useState(''); // Stores selected duration key
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const durationDropdownRef = useRef(null); // Ref for duration dropdown
  const durationButtonRef = useRef(null); // Ref for duration button

  // Debounce mechanism for destination search
  const debounceTimeoutRef = useRef(null);

  // Group size options mapping keys to display text and range
  const groupSizeOptions = [
    { key: 'personal', label: 'Personal (1 person)', min: 1, max: 1 },
    { key: 'small', label: 'Small Group (2-5 people)', min: 2, max: 5 },
    { key: 'medium', label: 'Medium Group (6-12 people)', min: 6, max: 12 },
    { key: 'large', label: 'Large Group (13+ people)', min: 13, max: null }
  ];

  // Duration options mapping keys to display text and range (in days)
  const durationOptions = [
    { key: '', label: 'Any duration', min: null, max: null },
    { key: '1-3', label: '1-3 days', min: 1, max: 3 },
    { key: '4-7', label: '4-7 days', min: 4, max: 7 },
    { key: '8-14', label: '8-14 days', min: 8, max: 14 },
    { key: '15+', label: '15+ days', min: 15, max: null }
  ];

  // Effect to handle clicks outside suggestions/dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // Close destination suggestions
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
      // Close group size dropdown
      if (groupSizeDropdownRef.current && !groupSizeDropdownRef.current.contains(event.target) &&
          event.target.id !== 'groupSizeButton') {
        setShowGroupSizeDropdown(false);
      }
      // Close duration dropdown
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target) &&
          durationButtonRef.current && !durationButtonRef.current.contains(event.target)) {
        setShowDurationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to fetch destination suggestions from Supabase
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tours')
        .select('province, country, title, slug')
        .or(
          `province.ilike.%${query}%,` +
          `country.ilike.%${query}%,` +
          `title.ilike.%${query}%`
        )
        .limit(5);

      if (error) {
        console.error('Error fetching destination suggestions:', error);
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
        return;
      }

      const uniqueSuggestions = new Set();
      data.forEach(item => {
        if (item.province) uniqueSuggestions.add(item.province);
        if (item.country) uniqueSuggestions.add(item.country);
        if (item.title) uniqueSuggestions.add(item.title);
      });

      setDestinationSuggestions(Array.from(uniqueSuggestions).slice(0, 5));
      setShowDestinationSuggestions(true);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  const handleDestinationChange = (e) => {
    setDestinationInput(e.target.value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(e.target.value.toLowerCase());
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setDestinationInput(suggestion);
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
  };

  const handleGroupSizeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGroupSizes(prev =>
      checked ? [...prev, value] : prev.filter(size => size !== value)
    );
  };

  // Handle duration selection
  const handleDurationSelect = (key) => {
    setSelectedDurationKey(key);
    setShowDurationDropdown(false);
  };

  return (
    <section
      className="relative w-full min-h-[100vh] bg-cover bg-center bg-no-repeat flex flex-col justify-center text-white px-4 pt-28 pb-40 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your world of joy</h1>
        <p className="text-lg md:text-xl mb-12">
          From local escapes to far-flung adventures,<br className="hidden md:block" />
          find what makes you happy anytime, anywhere.
        </p>

        {/* Search Form */}
        <form action="/search" method="GET">
          <div className="backdrop-blur-lg bg-white/80 text-[#1A1A4B] rounded-3xl shadow-2xl max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/30">

            {/* Destination with Auto-Suggestion */}
            <div className="relative flex items-center w-full md:w-auto flex-1 gap-3" ref={searchInputRef}>
              <FaMapMarkerAlt className="text-gray-400" />
              <input
                type="text"
                name="destination"
                placeholder="Search destinations"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
                value={destinationInput}
                onChange={handleDestinationChange}
                onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                autoComplete="off"
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <ul ref={suggestionsRef} className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 text-gray-800 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Duration Selector (replaces Date Range Picker) */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaClock className="text-gray-400" />
              <button
                type="button"
                id="durationButton"
                ref={durationButtonRef}
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none text-left text-gray-500 py-2"
                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
              >
                {durationOptions.find(opt => opt.key === selectedDurationKey)?.label || 'Any duration'}
              </button>
              {showDurationDropdown && (
                <div ref={durationDropdownRef} className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden text-left py-2">
                  {durationOptions.map(option => (
                    <div
                      key={option.key}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                      onClick={() => handleDurationSelect(option.key)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Group Size Selection */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaUsers className="text-gray-400" />
              <select
                name="groupSize" // This is still a select, not checkboxes, based on the last HeroBanner you provided.
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
                defaultValue=""
              >
                <option value="">All group sizes</option>
                <option value="personal">Personal (1 person)</option>
                <option value="small">Small Group (2-5 people)</option>
                <option value="medium">Medium Group (6-12 people)</option>
                <option value="large">Large Group (13+ people)</option>
              </select>
            </div>

            {/* Hidden input for duration range */}
            <input type="hidden" name="durationRange" value={selectedDurationKey} />

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#EB662B] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition duration-200 flex items-center gap-2"
            >
              <FaSearch /> Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
