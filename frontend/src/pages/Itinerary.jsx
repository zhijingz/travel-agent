import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';

function StreamingResponse({ content, speed = 20 }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!content) return;
    
    setDisplayedContent('');
    indexRef.current = 0;
    
    const timer = setInterval(() => {
      if (indexRef.current < content.length) {
        setDisplayedContent(prev => prev + content.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed]);

  return (
    <div style={{ color: '#e6e6e6' }}>
      {displayedContent}
      {indexRef.current < content.length && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          backgroundColor: '#ff6b9d',
          animation: 'blink 1s infinite',
          marginLeft: '2px'
        }}></span>
      )}
    </div>
  );
}

function Itinerary() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    interests: ''
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fullItinerary, setFullItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const itineraryRef = useRef(null);

  // Scroll to bottom when itinerary updates
  useEffect(() => {
    if (itineraryRef.current && fullItinerary) {
      itineraryRef.current.scrollTop = itineraryRef.current.scrollHeight;
    }
  }, [fullItinerary]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.origin || !formData.destination || !formData.interests) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('Please select travel dates');
      return;
    }

    setIsLoading(true);
    setError('');
    setFullItinerary(null);
    
    try {
      const formattedStart = startDate.toISOString().slice(0, 10);
      const formattedEnd = endDate.toISOString().slice(0, 10);
      
      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        interests: formData.interests,
        date_from: formattedStart,
        date_to: formattedEnd
      };
      
      const response = await fetch('http://localhost:5002/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }
      
      const data = await response.json();
      setFullItinerary(data.itinerary);
    } catch (error) {
      setError(error.message || 'Failed to create itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadItinerary = () => {
    if (!fullItinerary) return;
    
    const blob = new Blob([fullItinerary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.destination}-itinerary.md`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="bg-gray-900 text-gray-100 px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="max-w-lg mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-pink-300 mt-10">Plan Your Perfect Trip</h1>
          <p className="text-lg text-gray-200">
            Create a customized itinerary based on your travel preferences
          </p>
        </div>
        
        <div className="shadow-lg overflow-hidden max-w-3xl bg-gray-800 rounded-xl">
          <div className="p-6">
            <h5 className="text-xl font-semibold mb-2 text-pink-200">
              Travel Itinerary Planner
            </h5>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-300">Origin City*</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                  placeholder="Where are you traveling from?"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-300">Destination*</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                  placeholder="Where do you want to go?"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-300">Start Date*</label>
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-300">End Date*</label>
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-300">Interests*</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., hiking, museums, food"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-600"
              >
                {isLoading ? 'Creating Itinerary...' : 'Generate Itinerary'}
              </button>
              
              {error && (
                <div className="p-3 bg-pink-900 text-pink-200 rounded-md">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      

      {/* Results Section */}
      {fullItinerary && (
        <div className="max-w-2xl mx-auto mb-16">
          <div className="shadow-lg overflow-hidden w-full bg-gray-800 rounded-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-pink-200">Your Travel Itinerary</h3>
                <button
                  onClick={downloadItinerary}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                  </svg>
                  Download
                </button>
              </div>
              
              <div 
                ref={itineraryRef}
                className="bg-gray-700 rounded-lg p-4 max-h-[50vh] overflow-y-auto"
              >
                <StreamingResponse content={fullItinerary} speed={10} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meet the Agents Section */}
      <div className="mb-16">
        <div className="mb-6 ">
          <h2 className="text-2xl font-bold mb-4 mb-4 text-pink-300">Meet the Agents</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* DestinationAgent */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
            <div className="p-6 flex flex-col items-center">
              <div className="agent-avatar-placeholder mb-4 bg-blue-700 text-white w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold">DA</div>
              <h5 className="text-xl font-semibold mb-2 text-blue-200">DestinationAgent</h5>
              <p className="text-gray-400 mb-4 text-center">
                Provides cultural insights, safety tips, and local customs for destinations.
              </p>
              <Link
                to="/Destination"
                className="mt-auto py-2 px-4 border border-pink-blue text-blue-400 rounded-md hover:bg-blue-900 transition-colors"
              >
                Ask about destinations
              </Link>
            </div>
          </div>
          
        </div>
      </div>
      </div>
    </div>
  );
}

export default Itinerary;