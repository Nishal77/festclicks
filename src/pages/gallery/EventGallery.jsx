import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Filter, ImageIcon, VideoIcon, AlertCircle, AlertTriangle, ShieldAlert, ChevronDown } from "lucide-react";
// Import the images
import sentia1Image from "../../assets/sentia1.jpeg";
import onamImage from "../../assets/onam.jpeg";
// Import the ImageGrid component
import ImageGrid from "../../components/gallery/ImageGrid";
// Import Footer component
import Footer from "../../components/layout/Footer";
// Import shadcn dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
// Import the alert dialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Function to generate unique IDs
const generateUniqueId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);

// Prepare event-specific images with the format needed for ImageGrid
const eventGalleryImages = {
  sentia: [
    // First column
    { 
      id: generateUniqueId(),
      src: sentia1Image,
      alt: "Sentia Dance Competition",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      alt: "Sentia Music Festival",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/772571/pexels-photo-772571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      alt: "Sentia Night Event",
      category: "Sentia"
    },
    
    // Second column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Performance",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Sentia Stage Performance",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3673762/pexels-photo-3673762.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia DJ",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Crowd",
      category: "Sentia"
    },
    
    // Third column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4000421/pexels-photo-4000421.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Band",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Sentia Award Ceremony",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4197439/pexels-photo-4197439.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Stage",
      category: "Sentia"
    },
    
    // Fourth column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/2248516/pexels-photo-2248516.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Background",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4555468/pexels-photo-4555468.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Sentia Lights",
      category: "Sentia"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Sentia DJ Night",
      category: "Sentia"
    },
  ],
  onam: [
    // First column
    {
      id: generateUniqueId(),
      src: onamImage,
      alt: "Onam Celebration",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      alt: "Onam Festival Crowd",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/772571/pexels-photo-772571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      alt: "Onam Night Celebration",
      category: "Onam"
    },
    
    // Second column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Traditional Performance",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Onam Flower Decoration",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3673762/pexels-photo-3673762.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Stage",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Audience",
      category: "Onam"
    },
    
    // Third column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4000421/pexels-photo-4000421.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Dance Performance",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1582560474981-e5d9accfb940?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Onam Pookalam",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4197439/pexels-photo-4197439.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Stage",
      category: "Onam"
    },
    
    // Fourth column
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/2248516/pexels-photo-2248516.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Background",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.pexels.com/photos/4555468/pexels-photo-4555468.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      alt: "Onam Celebration Lights",
      category: "Onam"
    },
    { 
      id: generateUniqueId(),
      src: "https://images.unsplash.com/photo-1602522676272-f2c6c6d5cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Onam Boat Race",
      category: "Onam"
    },
  ],
};

// Event details
const eventDetails = {
  sentia: {
    title: "Sentia: Official Freshers Party",
    description: "Relive the memories of Sentia, the ultimate freshers party that welcomed new students with music, dance, and festivities!",
  },
  onam: {
    title: "Onam: A Festival of Joy & Tradition",
    description: "Experience the vibrant cultural heritage of Kerala's harvest festival through our collection of Onam celebration photos and videos.",
  }
};

export default function EventGallery() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("images");
  const [eventImages, setEventImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [eventInfo, setEventInfo] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading delay for the skeleton to show
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set up initial event info based on the slug
  useEffect(() => {
    // Set event-specific images if available, otherwise empty array
    const images = eventGalleryImages[eventSlug] || [];
    setEventImages(images);
    setFilteredImages(images);
    
    // Set event info
    const info = eventDetails[eventSlug] || { 
      title: "Event Gallery", 
      description: "View photos and videos from this event." 
    };
    setEventInfo(info);
    
    // Handle invalid event slug
    if (!eventDetails[eventSlug]) {
      console.warn(`No event found for slug: ${eventSlug}`);
    }
  }, [eventSlug]);

  // Filter images when category changes
  useEffect(() => {
    if (category === "all") {
      setFilteredImages(eventImages);
    } else {
      const filtered = eventImages.filter(image => image.category === category);
      setFilteredImages(filtered);
    }
  }, [category, eventImages]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleContentTypeChange = (newContentType) => {
    setContentType(newContentType);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D1D1D] border border-gray-800/30 text-gray-200 hover:bg-gray-800 transition-colors" 
                style={{ borderWidth: '0.5px', borderColor: 'hsl(var(--border))' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back</span>
              </button>
              
              
            </div>

            <div className="flex items-center">              
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1D1D1D] border border-gray-800/30 hover:bg-gray-800 transition-colors" style={{ borderWidth: '0.5px', borderColor: 'hsl(var(--border))' }}>
                <User className="h-4.5 w-4.5 text-gray-300" />
                <span className="sr-only">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-[2000px] mx-auto px-4 pt-24 pb-8">
        {isLoading ? (
          /* Skeleton Loading UI */
          <div className="w-full">
            {/* Hero Section Skeleton */}
            <section className="mb-16 w-full">
              <Skeleton className="h-24 md:h-32 lg:h-48 w-3/4 mb-4" style={{ backgroundColor: '#131313' }} />
              <Skeleton className="h-4 md:h-6 w-1/2" style={{ backgroundColor: '#131313' }} />
            </section>

            {/* Event Info Section Skeleton */}
            <section className="mb-10">
              <Skeleton className="h-8 md:h-10 w-1/3 mb-3" style={{ backgroundColor: '#131313' }} />
              <Skeleton className="w-20 h-1 mb-6" style={{ backgroundColor: '#131313' }} />
            </section>

            {/* Filters Skeleton */}
            <div className="flex justify-end mb-12">
              <Skeleton className="h-10 w-48" style={{ backgroundColor: '#131313' }} />
            </div>

            {/* Image Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
              {Array(12).fill().map((_, idx) => (
                <Skeleton 
                  key={idx} 
                  className="rounded-md" 
                  style={{ 
                    backgroundColor: '#131313',
                    aspectRatio: idx % 2 === 0 ? '3/4' : '4/3'
                  }} 
                />
              ))}
            </div>
          </div>
        ) : (
          /* Actual Content */
          <>
            {/* Hero Section */}
            <section className="mb-16 w-full">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] font-bold mb-4 w-full text-left tracking-tight leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                No More Lost Memories!
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl whitespace-nowrap overflow-hidden text-ellipsis font-medium tracking-wide">
                Lost photos? Not anymore—find every fest moment in seconds!
              </p>
            </section>

            {/* Event Info Section */}
            <section className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {eventInfo.title}
              </h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>
            </section>

            {/* Disclaimer Button - Placed directly below the event title */}
            

            {/* Controls Section */}
            <div className="flex flex-row items-center justify-between gap-4 mb-2">
              {/* Left side - Request image removal */}
              <div>
                <AlertDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
                  <AlertDialogTrigger asChild>
                    <button className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-black border text-sm hover:bg-[#1D1D1D] transition-all">
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                      <span className="text-red-400 font-medium">Disclaimer</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black border border-red-500/30 text-white max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-500 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Image Removal Policy</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        <p className="mb-4">
                          Note: For image removal, contact <span className="font-bold text-red-400">@contactadmin</span>.
                        </p>
                        <p className="mb-4">
                          Send a screenshot via email with the category (optional: reason).
                        </p>
                        <p className="text-red-300 font-semibold">
                          No questions asked—removal is immediate.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600">Understood</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              {/* Right side - Filters */}
              <div className="flex space-x-4">
                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-between w-36 space-x-2 px-4 py-2 rounded-lg bg-black border border-gray-800 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{category === "all" ? "All Categories" : category}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-36 bg-black border border-gray-800 text-white">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                      onClick={() => handleCategoryChange("all")}
                    >
                      <span>All Categories</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                      onClick={() => handleCategoryChange("Sentia")}
                    >
                      <span>Sentia</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                      onClick={() => handleCategoryChange("Onam")}
                    >
                      <span>Onam</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Content Type Selector */}
                <div>
                  {/* Large screens - Direct buttons */}
                  <div className="hidden md:flex items-center space-x-4">
                    <button 
                      onClick={() => handleContentTypeChange('images')} 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        contentType === 'images' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                          : 'text-gray-400 hover:bg-white/5 border border-gray-800'
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>Images</span>
                    </button>
                    
                    <button 
                      onClick={() => handleContentTypeChange('videos')} 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        contentType === 'videos' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                          : 'text-gray-400 hover:bg-white/5 border border-gray-800'
                      }`}
                    >
                      <VideoIcon className="h-4 w-4" />
                      <span>Videos</span>
                    </button>
                  </div>
                  
                  {/* Small/Medium screens - Dropdown */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-between w-36 space-x-2 px-4 py-2 rounded-lg bg-black border border-gray-800 text-gray-300">
                        <div className="flex items-center gap-2">
                          {contentType === 'images' ? (
                            <>
                              <ImageIcon className="h-4 w-4" />
                              <span>Images</span>
                            </>
                          ) : (
                            <>
                              <VideoIcon className="h-4 w-4" />
                              <span>Videos</span>
                            </>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-36 bg-black border border-gray-800 text-white">
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                          onClick={() => handleContentTypeChange('images')}
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Images</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                          onClick={() => handleContentTypeChange('videos')}
                        >
                          <VideoIcon className="h-4 w-4" />
                          <span>Videos</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Grid - Use filtered images */}
            <div className="mb-16">
              <ImageGrid eventImages={filteredImages} />
            </div>
          </>
        )}
        
        {/* Page-specific Footer */}
        <footer className="mt-16 py-8 text-center text-gray-600 text-xs">
          <p>© {new Date().getFullYear()} FestClicks. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 