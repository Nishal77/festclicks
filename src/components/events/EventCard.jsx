import { Calendar, Star, Clock, Users, ArrowUpRight } from "lucide-react"
import { Button } from "../ui/button"
// Import the images
import sentia1Image from "../../assets/sentia1.jpeg"
import onamImage from "../../assets/onam.jpeg"
import { useNavigate } from "react-router-dom"

export default function EventCard({ event }) {
  const navigate = useNavigate();
  
  // Extract event data safely with fallbacks
  const title = event?.title || "Event Title";
  const description = event?.description || "Event description";
  const date = event?.date instanceof Date ? event.date : new Date();
  
  // Format date - simplified to only show year
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  // Check if this is a special card
  const isSentiaCard = event?.id === 'mock-1' && event?.title.includes('Sentia');
  const isOnamCard = event?.id === 'mock-2' && event?.title.includes('Onam');

  // Get the event slug for the URL
  const getEventSlug = () => {
    if (isSentiaCard) return "sentia";
    if (isOnamCard) return "onam";
    return event?.id || "event";
  };

  // Get the image from the event or fallback
  const getImageSrc = () => {
    if (isSentiaCard) {
      return sentia1Image; // Use the imported image for Sentia
    }
    if (isOnamCard) {
      return onamImage; // Use the imported image for Onam
    }
    return event?.image || '/placeholder.svg?height=600&width=400';
  };

  // Handle navigation to the gallery
  const handleGalleryClick = () => {
    // Navigate directly to the gallery page
    // This will show the skeleton loading state immediately
    const eventSlug = getEventSlug();
    navigate(`/${eventSlug}/gallery`);
  };

  return (
    <div className="max-w-sm mx-auto group">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-gray-900/90 to-gray-900/80 border border-gray-700/30 shadow-md transition-all duration-300 group-hover:shadow-xl" style={{ borderWidth: '0.5px' }}>
        {/* Top shadow on hover */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        {/* Bottom shadow on hover */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        {/* Background image */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center ${
            isSentiaCard ? 'opacity-90' : 
            isOnamCard ? 'opacity-80' : 
            'opacity-40 mix-blend-overlay'
          }`}
          style={{
            backgroundImage: `url(${getImageSrc()})`,
            filter: isSentiaCard ? 'blur(3px)' : 
                   isOnamCard ? 'blur(3px)' : 
                   "blur(20px)", // Subtle blur for Sentia & Onam, stronger for others
          }}
        />

        {/* Dark overlay for better text visibility */}
        <div className={`absolute inset-0 ${
          isOnamCard ? 'bg-black/50' : 'bg-black/40'
        }`}></div>

        {/* Content container */}
        <div className="relative p-6 flex flex-col min-h-[380px]">
          {/* Top row with date and interactive elements */}
          <div className="flex justify-between items-start mb-4">
            {/* Year badge - elegant design */}
            <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 py-2 px-4 flex items-center" style={{ borderWidth: '0.5px' }}>
              <Calendar className="h-4 w-4 text-blue-400 mr-2" />
              <span className="font-heading text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{year}</span>
            </div>

            {/* Interactive badges */}
            <div className="flex space-x-2">
              <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2 cursor-pointer hover:bg-black/80 transition-colors" style={{ borderWidth: '0.5px' }}>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2 cursor-pointer hover:bg-black/80 transition-colors" style={{ borderWidth: '0.5px' }}>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Title and description - adjusted positioning */}
          <div className="space-y-3 mt-auto mb-6">
            <h3 className="text-2xl md:text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {description}
            </p>
          </div>

          {/* Custom Join button with professional design */}
          <div 
            className="relative w-11/12 h-11 mx-auto rounded-md overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleGalleryClick}
            onKeyDown={(e) => e.key === 'Enter' && handleGalleryClick()}
          >
            {/* Pure white background */}
            <div className="absolute inset-0 bg-white"></div>
            
            {/* Button border with subtle glow effect */}
            <div className="absolute inset-0 border border-gray-200 rounded-md hover:border-gray-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]" style={{ borderWidth: '0.5px' }}></div>
            
            {/* Elegant gradient effect on hover */}
            <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button shine effect - subtle beam of light */}
            <div className="absolute inset-0 opacity-0 hover:opacity-20 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full hover:translate-x-full transition-all duration-700 ease-out"></div>
            
            {/* Button icon */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-5 w-5 text-black hover:scale-110 transition-transform duration-300" />
            </div>
            
            {/* Button text with elegant styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black text-base font-bold tracking-widest uppercase flex items-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <span className="relative pl-2">
                  {/* Main text */}
                  <span className="relative z-10">View Gallery</span>
                  
                  {/* Underline effect on hover */}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent transform scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 