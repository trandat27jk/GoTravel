// app/components/HeroBanner.js
"use client";
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import DatePicker from 'react-datepicker';
// Changed FaListUl to FaUsers for group size icon, FaCalendarAlt for DatePicker, FaClock for Duration
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

// Import your Supabase client for fetching destination suggestions
import supabase from '../utils/supabase/client'; // Adjust path as needed

export default function HeroBanner() {
  // State for Date Range Picker
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // States for Destination auto-suggestion
  const [destinationInput, setDestinationInput] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const searchInputRef = useRef(null); // Ref for the destination input
  const suggestionsRef = useRef(null); // Ref for destination suggestions dropdown container
  const debounceTimeoutRef = useRef(null); // Ref for debouncing the suggestion fetch

  // States for Duration selection dropdown (custom dropdown, not DatePicker)
  const [selectedDurationKey, setSelectedDurationKey] = useState(''); // Stores selected duration key (e.g., '4-7')
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const durationDropdownRef = useRef(null); // Ref for duration dropdown container
  const durationButtonRef = useRef(null); // Ref for the button that toggles duration dropdown

  // Group size options mapping keys to display text and range
  const groupSizeOptions = [
    { key: '', label: 'All group sizes' }, // Default/placeholder
    { key: 'personal', label: 'Personal (1 person)' },
    { key: 'small', label: 'Small Group (2-5 people)' },
    { key: 'medium', label: 'Medium Group (6-12 people)' },
    { key: 'large', label: 'Large Group (13+ people)' }
  ];

  // Duration options mapping keys to display text and range (in days)
  const durationOptions = [
    { key: '', label: 'Any duration' }, // Default/placeholder
    { key: '1-3', label: '1-3 days' },
    { key: '4-7', label: '4-7 days' },
    { key: '8-14', label: '8-14 days' },
    { key: '15+', label: '15+ days' }
  ];

  // Effect to handle clicks outside suggestions/dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // Close destination suggestions if click is outside input or suggestion list
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
      // Close duration dropdown if click is outside dropdown or its toggle button
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

  // Handle change in destination input with debouncing
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value); // Update input state immediately

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value.toLowerCase()); // Fetch suggestions after debounce
    }, 300); // 300ms debounce delay
  };

  // Handle click on a destination suggestion
  const handleSuggestionClick = (suggestion) => {
    setDestinationInput(suggestion); // Set input value to the clicked suggestion
    setDestinationSuggestions([]); // Clear suggestions
    setShowDestinationSuggestions(false); // Hide suggestions
  };

  // Handle duration selection from the custom dropdown
  const handleDurationSelect = (key) => {
    setSelectedDurationKey(key); // Update selected duration key
    setShowDurationDropdown(false); // Close dropdown
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
            {/* Ref attached to the container div to handle clicks outside */}
            <div className="relative flex items-center w-full md:w-auto flex-1 gap-3" ref={searchInputRef}>
              <FaMapMarkerAlt className="text-gray-400" />
              <input
                type="text"
                name="destination"
                placeholder="Search destinations"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
                value={destinationInput} // Controlled component
                onChange={handleDestinationChange} // Update state on change
                // Show suggestions on focus if input has content (for re-opening after closing)
                onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                autoComplete="off" // Disable browser's built-in autocomplete
              />
              {/* Suggestions dropdown */}
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <ul ref={suggestionsRef} className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 text-gray-800 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <li
                      key={index} // Using index as key is okay for static lists, but unique IDs are better if available
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Range Picker (Removed DatePicker, now Duration Selector) */}
            {/* Using a custom dropdown for Duration, sending 'durationRange' */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaClock className="text-gray-400" /> {/* Changed icon to FaClock */}
              <button
                type="button" // Important: type="button" to prevent form submission
                id="durationButton"
                ref={durationButtonRef}
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none text-left text-gray-700 py-2"
                onClick={() => setShowDurationDropdown(!showDurationDropdown)} // Toggle dropdown visibility
              >
                {/* Display label for selected duration or default */}
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

            {/* Group Size Selection (Standard Select Dropdown) */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaUsers className="text-gray-400" /> {/* Icon changed to FaUsers */}
              <select
                name="groupSize" // This name will be used in page.tsx
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none text-gray-700"
                defaultValue="" // Sets the default selected option
              >
                {groupSizeOptions.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden input for duration range to be sent to page.tsx */}
            <input type="hidden" name="durationRange" value={selectedDurationKey} />

            {/* Hidden inputs for original startDate and endDate (if still needed for other purposes, otherwise remove) */}
            {/* These were from the DatePicker, but if DatePicker is removed, these might not be needed */}
            {/* <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} /> */}
            {/* <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} /> */}


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
