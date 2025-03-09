import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchEvents, checkTableExists } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/events/EventCard';
import { Button } from '../../components/ui/button';
import coverVideo from '../../assets/covervideo.mp4';
import React from 'react';
// Import the images for mock events
import sentia1Image from '../../assets/sentia1.jpeg';
import onamImage from '../../assets/onam.jpeg';
// Import Footer component
import Footer from '../../components/layout/Footer';

// Add Satoshi font imports and styles
const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { user, userData, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Get user's name for greeting
  const userName = userData?.name || 'there';

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        
        // First check if the events table exists
        const eventsTableExists = await checkTableExists('events');
        
        if (!eventsTableExists) {
          // If table doesn't exist, use empty array (will use mock events later)
          setEvents([]);
          setLoading(false);
          return;
        }
        
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading events:', err);
        // Don't show errors to users, just use mock events
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Video loaded handler
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Convert existing events to the format expected by the new EventCard
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.name,
    description: event.description,
    date: event.date,
    image: event.cover_image
  }));

  // Mock events for when no events are available
  const mockEvents = [
    {
      id: 'mock-1',
      title: 'Sentia: Official Freshers Party',
      description: 'Join us for the official freshers party to welcome new students and celebrate the beginning of a new academic year!',
      date: new Date('2023-12-15'),
      image: sentia1Image
    },
    {
      id: 'mock-2',
      title: 'Onam: A Festival of Joy & Tradition! ',
      description: 'Celebrate Onam, the vibrant festival of Kerala, filled with grand feasts, cultural performances, and the spirit of togetherness!',
      date: new Date('2023-11-12'),
      image: onamImage
    },
    {
      id: 'mock-3',
      title: 'Cultural Festival',
      description: 'Experience diverse cultures through music, dance, and food',
      date: new Date('2023-10-20'),
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80'
    }
  ];

  // Decide which events to display - real ones or mock ones if no real events
  const displayEvents = events.length > 0 ? formattedEvents : mockEvents;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans"> 
      {/* Hero section with cover video */}
      <section className="relative h-[450px] md:h-[550px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {/* Video background with fade effect */}
          <div className={`w-full h-full transition-opacity duration-700 ${videoLoaded ? 'opacity-70' : 'opacity-0'}`}>
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
              onLoadedData={handleVideoLoaded}
            >
              <source src={coverVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Video overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/30 to-gray-950/70"></div>
        </div>

        {/* Centered Text Overlay with enhanced animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
          <div className={`text-center px-4 transition-all duration-1000 transform ${videoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-white font-display" style={{ fontFamily: 'Panchang, sans-serif' }}>
                SENTIA 2025
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
            From Competitions to Concerts – Sentia Has It All!
            </p>
            {isAdmin && (
              <div className="mt-6">
                <Link to="/admin/events">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-5 text-base font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    MANAGE EVENTS
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Error display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-200 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{error}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-heading"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            TRY AGAIN
          </Button>
        </div>
      )}

      {/* Events section with improved heading */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-white font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              FEATURED EXPERIENCES
            </h2>
            <p className="text-gray-400 mt-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Discover and join upcoming events</p>
          </div>
          {isAdmin && (
            <Link to="/admin/events">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                NEW EVENT
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </section>

      {/* Page-specific Footer */}
    </main>
  );
};

export default Dashboard; 