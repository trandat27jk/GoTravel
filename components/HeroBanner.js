// components/HeroBanner.js
"use client";
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, useRef } from 'react'; // Add useEffect and useRef
import DatePicker from 'react-datepicker';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaListUl } from 'react-icons/fa';

import supabase from '../utils/supabase/client'; // Import your client-side Supabase client

export default function HeroBanner() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // New states for destination search suggestions
  const [destinationInput, setDestinationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // To control visibility of the dropdown
  const searchInputRef = useRef(null); // Ref for the destination input
  const suggestionsRef = useRef(null); // Ref for the suggestions dropdown

  // Debounce mechanism to limit API calls
  const debounceTimeoutRef = useRef(null);

  // Effect to handle clicks outside the suggestions to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Function to fetch suggestions from Supabase
  const fetchSuggestions = async (query) => {
    if (query.length < 2) { // Only search if query is at least 2 characters long
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // You can customize which columns to search for suggestions
    // Based on your previous schema: title, province, country, description, slug
    let { data, error } = await supabase
      .from('tours') // Assuming your table name is 'tours'
      .select('title, province, country, slug') // Select only the columns you need for suggestions
      .or(
        `title.ilike.%${query}%,` +
        `province.ilike.%${query}%,` +
        `country.ilike.%${query}%,` +
        `slug.ilike.%${query}%`
      )
      .limit(8); // Limit the number of suggestions

    if (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } else {
      // Process suggestions to remove duplicates and format them
      const uniqueSuggestions = [];
      const seenTitles = new Set();
      data.forEach(item => {
        // Prioritize title, then province, then country
        let suggestionText = item.title;
        if (!seenTitles.has(suggestionText)) {
          uniqueSuggestions.push({ type: 'tour', text: suggestionText, value: suggestionText });
          seenTitles.add(suggestionText);
        }

        if (item.province && !seenTitles.has(item.province)) {
          uniqueSuggestions.push({ type: 'province', text: `${item.province}, ${item.country}`, value: item.province });
          seenTitles.add(item.province);
        } else if (item.country && !seenTitles.has(item.country)) {
          uniqueSuggestions.push({ type: 'country', text: item.country, value: item.country });
          seenTitles.add(item.country);
        }
      });
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(uniqueSuggestions.length > 0);
    }
  };

  // Handle input change for destination field
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value); // Update input state immediately

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value.toLowerCase());
    }, 300); // 300ms debounce time
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (suggestionValue) => {
    setDestinationInput(suggestionValue); // Set input to the clicked suggestion
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide the suggestion dropdown
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

            {/* Destination Input with Suggestions */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 relative"> {/* Added relative for positioning */}
              <FaMapMarkerAlt className="text-gray-400" />
              <input
                ref={searchInputRef} // Attach ref to the input
                type="text"
                name="destination"
                placeholder="Search destinations"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
                value={destinationInput} // Controlled component
                onChange={handleDestinationChange} // Handle input changes
                onFocus={() => destinationInput.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)} // Show on focus if input has length and suggestions exist
                autoComplete="off" // Prevent browser autocomplete
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  ref={suggestionsRef} // Attach ref to suggestions ul
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden text-left"
                >
                  {suggestions.map((s, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-gray-700 text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(s.value)}
                    >
                      {s.type === 'tour' && <FaSearch className="text-gray-400 text-xs" />}
                      {s.type === 'province' && <FaMapMarkerAlt className="text-gray-400 text-xs" />}
                      {s.type === 'country' && <FaMapMarkerAlt className="text-gray-400 text-xs" />}
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200">
              <FaCalendarAlt className="text-gray-400" />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Select travel dates"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Tour Type */}
            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200">
              <FaListUl className="text-gray-400" />
              <input
                type="text"
                name="tour"
                placeholder="All tours"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Hidden Date Inputs (remain the same) */}
            <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
            <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />

            {/* Search Button (remains the same) */}
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