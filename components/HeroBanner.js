// app/components/HeroBanner.js
"use client";
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

import {createClient} from '../utils/supabase/client'; // Adjust path as needed

const supabase = createClient();
export default function HeroBanner() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [destinationInput, setDestinationInput] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const [selectedDurationKey, setSelectedDurationKey] = useState('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const durationDropdownRef = useRef(null);
  const durationButtonRef = useRef(null);

  // Moved groupSizeOptions and durationOptions inside the component
  // to satisfy react-hooks/exhaustive-deps warning if they were to be used in useEffect
  // Although in this specific code, they are not directly used in the useEffect for data fetching.
  // This addresses the general warning pattern.
  const groupSizeOptions = [
    { key: '', label: 'All group sizes' },
    { key: 'personal', label: 'Personal (1 person)' },
    { key: 'small', label: 'Small Group (2-5 people)' },
    { key: 'medium', label: 'Medium Group (6-12 people)' },
    { key: 'large', label: 'Large Group (13+ people)' }
  ];

  const durationOptions = [
    { key: '', label: 'Any duration' },
    { key: '1-3', label: '1-3 days' },
    { key: '4-7', label: '4-7 days' },
    { key: '8-14', label: '8-14 days' },
    { key: '15+', label: '15+ days' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target) &&
          durationButtonRef.current && !durationButtonRef.current.contains(event.target)) {
        setShowDurationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array as this effect doesn't depend on changing props/state from component scope

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

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (destinationInput.length >= 2) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(destinationInput.toLowerCase());
      }, 300);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [destinationInput]);


  const handleDestinationChange = (e) => {
    setDestinationInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setDestinationInput(suggestion);
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
  };

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your world of joy</h1>
        <p className="text-lg md:text-xl mb-12">
          From local escapes to far-flung adventures,<br className="hidden md:block" />
          find what makes you happy anytime, anywhere.
        </p>

        <form action="/search" method="GET">
          <div className="backdrop-blur-lg bg-white/80 text-[#1A1A4B] rounded-3xl shadow-2xl max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/30">

            <div className="relative flex items-center w-full md:w-auto flex-1 gap-3" ref={searchInputRef}>
              <FaMapMarkerAlt className="text-gray-400" />
              <input
                type="text"
                name="destination"
                placeholder="Search tours"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
                value={destinationInput}
                onChange={handleDestinationChange}
                onFocus={() => destinationInput.length >= 2 && setShowDestinationSuggestions(true)}
                autoComplete="off"
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <ul ref={suggestionsRef} className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl shadow-lg mt-1 z-20 text-gray-800 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-sm text-gray-700 hover:text-[#EB662B] transition duration-150 ease-in-out"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <FaMapMarkerAlt className="text-gray-400 text-xs" /> {/* Small icon next to each suggestion */}
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaClock className="text-gray-400" />
              <button
                type="button"
                id="durationButton"
                ref={durationButtonRef}
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none text-left text-gray-700 py-2"
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

            <div className="flex items-center w-full md:w-auto flex-1 gap-3 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200 relative">
              <FaUsers className="text-gray-400" />
              <select
                name="groupSize"
                className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none text-gray-700"
                defaultValue=""
              >
                {groupSizeOptions.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
            <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />

            <input type="hidden" name="durationRange" value={selectedDurationKey} />

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
