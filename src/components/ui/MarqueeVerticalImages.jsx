import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

// Concert/Festival specific images for the first column (moving top to bottom)
const firstColumnImages = [
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Concert stage with dramatic lighting"
  },
  {
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Live band performing on stage"
  },
  {
    url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Concert crowd with hands up"
  },
  {
    url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Musician playing guitar on stage"
  },
  {
    url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "DJ performing at music festival"
  }
];

// Concert/Festival specific images for the second column (moving bottom to top)
const secondColumnImages = [
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Crowded music festival at night"
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Concert with laser light show"
  },
  {
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Festival stage with fireworks"
  },
  {
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Vocalist performing on microphone"
  },
  {
    url: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80",
    alt: "Festival crowd dancing"
  }
];

const ImageCard = ({ url, alt }) => {
  return (
    <div
      className={cn(
        "relative h-80 w-56 overflow-hidden rounded-xl border p-1 mb-6",
        "border-gray-950/[.1] bg-gray-950/[.01]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10]",
      )}
    >
      <img 
        src={url} 
        alt={alt} 
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );
};

export function MarqueeVerticalImages() {
  return (
    <div className="relative flex h-[640px] w-full flex-row items-center justify-center overflow-hidden gap-4">
      {/* First column - Moving top to bottom */}
      <Marquee vertical className="[--duration:80s]" reverse>
        {firstColumnImages.map((image, index) => (
          <ImageCard key={`first-${index}`} {...image} />
        ))}
      </Marquee>
      
      {/* Second column - Moving bottom to top */}
      <Marquee vertical className="[--duration:80s]">
        {secondColumnImages.map((image, index) => (
          <ImageCard key={`second-${index}`} {...image} />
        ))}
      </Marquee>
      
      {/* Gradient overlays for smooth fade effect at top and bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
} 