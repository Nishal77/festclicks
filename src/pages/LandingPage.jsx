import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState, useRef } from "react";
import logoImage from '../assets/logodash.png';
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

// Define review data for the marquee
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const MarqueeDemoVertical = () => {
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
};

export default function LandingPage() {
  // Refs for marquee animation control
  const leftMarqueeRef = useRef(null);
  
  // Control scrolling states
  const [leftScrollActive, setLeftScrollActive] = useState(true);

  // Event images for scrolling sections
  const leftImages = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  // Handle scrolling animations using requestAnimationFrame for smoother performance
  useEffect(() => {
    const leftElement = leftMarqueeRef.current;
    
    if (!leftElement) return;
    
    let leftAnimationId;
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
    
    leftAnimationId = requestAnimationFrame(scrollLeft);
    
    return () => {
      if (leftAnimationId) cancelAnimationFrame(leftAnimationId);
    };
  }, [leftScrollActive]);

  // Pause and resume scrolling functions
  const handleLeftMouseEnter = () => setLeftScrollActive(false);
  const handleLeftMouseLeave = () => setLeftScrollActive(true);

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
               txt
                <br />
                <span className="text-gray-500">Platform</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl">
               lemme add some text
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
                  Upload Images
                </Button>
              </Link>
            </div>
          </div>

          {/* Replace right side components with Marquee */}
          <div className="relative h-[640px] w-full max-w-[818px] mx-auto overflow-hidden">
            <MarqueeDemoVertical />
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