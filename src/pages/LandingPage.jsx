import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef } from "react";
import logoImage from '../assets/logodash.png';

export default function LandingPage() {
  // Refs for marquee animation control
  const leftMarqueeRef = useRef(null);
  const rightMarqueeRef = useRef(null);
  
  // Control scrolling states
  const [leftScrollActive, setLeftScrollActive] = useState(true);
  const [rightScrollActive, setRightScrollActive] = useState(true);

  // Event images for scrolling sections
  const leftImages = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];
  
  const rightImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  // Handle scrolling animations using requestAnimationFrame for smoother performance
  useEffect(() => {
    const leftElement = leftMarqueeRef.current;
    const rightElement = rightMarqueeRef.current;
    
    if (!leftElement || !rightElement) return;
    
    let leftAnimationId, rightAnimationId;
    let lastTimestamp = 0;
    const scrollSpeed = 0.05; // pixels per millisecond
    
    // Left section scrolling (bottom to top)
    const scrollLeft = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      if (leftScrollActive) {
        leftElement.scrollTop -= scrollSpeed * elapsed; // Move upward
        
        // Reset scroll position when reaching the top for a seamless loop
        if (leftElement.scrollTop <= 0) {
          leftElement.scrollTop = leftElement.scrollHeight / 2;
        }
      }
      
      lastTimestamp = timestamp;
      leftAnimationId = requestAnimationFrame(scrollLeft);
    };
    
    // Right section scrolling (top to bottom)
    const scrollRight = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      if (rightScrollActive) {
        rightElement.scrollTop += scrollSpeed * elapsed; // Move downward
        
        // Reset scroll position when reaching the bottom for a seamless loop
        if (rightElement.scrollTop >= rightElement.scrollHeight / 2) {
          rightElement.scrollTop = 0;
        }
      }
      
      lastTimestamp = timestamp;
      rightAnimationId = requestAnimationFrame(scrollRight);
    };
    
    leftAnimationId = requestAnimationFrame(scrollLeft);
    rightAnimationId = requestAnimationFrame(scrollRight);
    
    return () => {
      if (leftAnimationId) cancelAnimationFrame(leftAnimationId);
      if (rightAnimationId) cancelAnimationFrame(rightAnimationId);
    };
  }, [leftScrollActive, rightScrollActive]);

  // Pause and resume scrolling functions
  const handleLeftMouseEnter = () => setLeftScrollActive(false);
  const handleLeftMouseLeave = () => setLeftScrollActive(true);
  const handleRightMouseEnter = () => setRightScrollActive(false);
  const handleRightMouseLeave = () => setRightScrollActive(true);

  return (
    <div className="dark min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="Sentia Logo" 
                className="h-10 w-auto rounded-md"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:inline-block text-white hover:text-gray-200 transition-colors">
              Login
            </Link>
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Rating Badge */}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-400">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="text-gray-300">
                Rated <span className="font-bold">5.0</span> on Shopify
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Meet the{" "}
                <span className="relative">
                  Super-fast
                  <div className="absolute w-full h-1 bg-yellow-400 bottom-2 left-0 opacity-50"></div>
                </span>
                <br />
                E-commerce Video
                <br />
                <span className="text-gray-500">Platform</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl">
                Packed with lightning-fast Shoppable videos, Interactive video quizzes, Live-stream shopping & more –
                All 3x faster than YouTube
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full px-8 py-6 text-lg">
                  Get Started — For Free!
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-gray-900 rounded-full px-8 py-6 text-lg"
                >
                  Book A Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Futuristic UI with scrolling content - Exactly matching reference image */}
          <div className="relative h-[640px] w-full max-w-[818px] mx-auto grid grid-cols-2 gap-4 rounded-3xl overflow-hidden">
            {/* Left Side - 2x2 Grid */}
            <div className="grid grid-rows-2 gap-4 h-full">
              {/* Yellow Stats Card - Top Left */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 flex flex-col justify-center">
                <div className="text-black">
                  <div className="text-4xl font-bold">11.17</div>
                  <div className="text-3xl font-bold">mins</div>
                  <div className="text-sm mt-2">Average Videos Watch Time</div>
                </div>
              </div>
              
              {/* Dynamic Scrolling Content - Bottom Left */}
              <div 
                className="relative overflow-hidden rounded-3xl"
                onMouseEnter={handleLeftMouseEnter}
                onMouseLeave={handleLeftMouseLeave}
              >
                {/* Bottom to Top Scrolling Container */}
                <div 
                  ref={leftMarqueeRef}
                  className="absolute inset-0 overflow-y-scroll scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {/* First set of images */}
                  <div className="h-full">
                    {leftImages.map((img, index) => (
                      <div key={`left-1-${index}`} className="mb-4 w-full h-full overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Event ${index + 1}`}
                          className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Duplicate set for seamless scrolling */}
                  <div className="h-full">
                    {leftImages.map((img, index) => (
                      <div key={`left-2-${index}`} className="mb-4 w-full h-full overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Event ${index + 1}`}
                          className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - 2x2 Grid */}
            <div className="grid grid-rows-2 gap-4 h-full">
              {/* Person with blue clothing - Top Right */}
              <div className="rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80"
                  alt="Person with blue clothing"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dynamic Scrolling Content - Bottom Right */}
              <div 
                className="relative overflow-hidden rounded-3xl grid grid-rows-2 gap-4"
              >
                {/* Green Stats Card - Top of Bottom Right */}
                <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-6 flex flex-col justify-center">
                  <div className="text-black">
                    <div className="text-4xl font-bold">60%</div>
                    <div className="text-sm mt-2">More sales this week</div>
                  </div>
                </div>
                
                {/* Product Card - Bottom of Bottom Right */}
                <div className="bg-gray-800 rounded-3xl p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&h=40&q=80"
                        alt="Product"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm">Glow Face Mask</div>
                      <div className="font-bold">$149.99</div>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button className="bg-black text-white hover:bg-gray-900 w-full mt-4 rounded-full">Buy Now</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Overlay Scrolling Content on Top */}
            <div 
              className="absolute top-0 right-0 w-1/2 h-full"
              onMouseEnter={handleRightMouseEnter}
              onMouseLeave={handleRightMouseLeave}
            >
              <div 
                ref={rightMarqueeRef}
                className="absolute top-0 right-0 w-full h-full overflow-y-scroll opacity-0 hover:opacity-100 transition-opacity duration-300 scrollbar-hide"
                style={{ scrollbarWidth: 'none', zIndex: 10 }}
              >
                {/* First set of images */}
                <div className="h-full py-4">
                  {rightImages.map((img, index) => (
                    <div key={`right-1-${index}`} className="mb-4 w-full h-full overflow-hidden rounded-xl">
                      <img 
                        src={img} 
                        alt={`Event ${index + 1}`}
                        className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Duplicate set for seamless scrolling */}
                <div className="h-full py-4">
                  {rightImages.map((img, index) => (
                    <div key={`right-2-${index}`} className="mb-4 w-full h-full overflow-hidden rounded-xl">
                      <img 
                        src={img} 
                        alt={`Event ${index + 1}`}
                        className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Live Event Streaming</h3>
            <p className="text-gray-400">Stream your events live with high-quality video and interactive features for remote attendees.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Event Marketing</h3>
            <p className="text-gray-400">Boost event attendance with targeted marketing campaigns and analytics to track performance.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Attendee Management</h3>
            <p className="text-gray-400">Seamlessly manage event registration, ticketing, and check-ins with our comprehensive tools.</p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">288%</div>
            <div className="text-gray-400">Uplift Conversions</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">20X</div>
            <div className="text-gray-400">Jump in product discovery</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">UP TO</div>
            <div className="text-5xl font-bold">392%</div>
            <div className="text-gray-400">Increase user engagement</div>
          </div>
        </div>
      </section>

      {/* Hide scrollbars for modern browsers */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  )
} 