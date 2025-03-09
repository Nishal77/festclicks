import { Calendar, Star, Clock, Users, ArrowUpRight } from "lucide-react"
import { Button } from "../ui/button"
// Import the correct image
import sentia1Image from "../../assets/sentia1.jpeg"

export default function EventCard({ event }) {
  // Extract event data safely with fallbacks
  const title = event?.title || "Event Title";
  const description = event?.description || "Event description";
  const date = event?.date instanceof Date ? event.date : new Date();
  
  // Format date - simplified to only show year
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  // Check if this is the Sentia card
  const isSentiaCard = event?.id === 'mock-1' && event?.title.includes('Sentia');

  // Get the image from the event or fallback
  const getImageSrc = () => {
    if (isSentiaCard) {
      return sentia1Image; // Use the imported image for Sentia
    }
    return event?.image || '/placeholder.svg?height=600&width=400';
  };

  return (
    <div className="max-w-sm mx-auto transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-gray-900/90 to-gray-900/80 border border-gray-800 shadow-xl">
        {/* Background image */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center ${isSentiaCard ? 'opacity-90' : 'opacity-40 mix-blend-overlay'}`}
          style={{
            backgroundImage: `url(${getImageSrc()})`,
            filter: isSentiaCard ? 'blur(3px)' : "blur(20px)", // Subtle blur for Sentia, stronger for others
          }}
        />

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content container */}
        <div className="relative p-6 flex flex-col min-h-[400px]">
          {/* Top row with date and interactive elements */}
          <div className="flex justify-between items-start mb-auto">
            {/* Year badge - elegant design */}
            <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 py-2 px-4 flex items-center">
              <Calendar className="h-4 w-4 text-blue-400 mr-2" />
              <span className="font-heading text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{year}</span>
            </div>

            {/* Interactive badges */}
            <div className="flex space-x-2">
              <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2 cursor-pointer hover:bg-black/80 transition-colors">
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-2 cursor-pointer hover:bg-black/80 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Additional info row */}
          <div className="flex mt-2 mb-4 space-x-4">
            <div className="flex items-center text-xs text-gray-300">
              <Clock className="h-3 w-3 mr-1 text-blue-400" />
              <span className="font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{month} {day}</span>
            </div>
            <div className="flex items-center text-xs text-gray-300">
              <Users className="h-3 w-3 mr-1 text-blue-400" />
              <span className="font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>500+ Attendees</span>
            </div>
          </div>

          {/* Main content */}
          <div className="mt-auto mb-6">
            <h2 className="text-white text-3xl font-medium mb-2 leading-tight font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              {title}
            </h2>
            <p className="text-gray-300 text-sm font-sans line-clamp-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {description}
            </p>
          </div>

          {/* Custom Join button with professional design */}
          <div 
            className="relative w-11/12 h-12 mx-auto rounded-md overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer group"
            role="button"
            tabIndex={0}
            onClick={() => console.log('Join event clicked')}
            onKeyDown={(e) => e.key === 'Enter' && console.log('Join event clicked')}
          >
            {/* Pure white background */}
            <div className="absolute inset-0 bg-white"></div>
            
            {/* Button border with subtle glow effect */}
            <div className="absolute inset-0 border border-gray-200 rounded-md group-hover:border-gray-300 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.05)]"></div>
            
            {/* Elegant gradient effect on hover */}
            <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button shine effect - subtle beam of light */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></div>
            
            {/* Button icon */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-5 w-5 text-black group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            {/* Button text with elegant styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black text-base font-bold tracking-widest uppercase flex items-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <span className="relative pl-2">
                  {/* Main text */}
                  <span className="relative z-10">Join Event</span>
                  
                  {/* Underline effect on hover */}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 