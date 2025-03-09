import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const ImageGrid = ({ eventImages = [] }) => {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  // Sample base images with mixed orientations
  const baseImages = [
    // Mix of landscape and portrait images
    { id: '1', src: 'https://images.pexels.com/photos/2106037/pexels-photo-2106037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630', alt: 'Concert image 1' },
    { id: '2', src: 'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', alt: 'Concert image 2' },
    { id: '3', src: 'https://images.pexels.com/photos/772571/pexels-photo-772571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', alt: 'Concert image 3' },
    { id: '4', src: 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 4' },
    { id: '5', src: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 5' },
    { id: '6', src: 'https://images.pexels.com/photos/3673762/pexels-photo-3673762.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 6' },
    { id: '7', src: 'https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 7' },
    { id: '8', src: 'https://images.pexels.com/photos/4000421/pexels-photo-4000421.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 8' },
    { id: '9', src: 'https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 9' },
    { id: '10', src: 'https://images.pexels.com/photos/4197439/pexels-photo-4197439.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 10' },
    { id: '11', src: 'https://images.pexels.com/photos/2248516/pexels-photo-2248516.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 11' },
    { id: '12', src: 'https://images.pexels.com/photos/4555468/pexels-photo-4555468.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', alt: 'Concert image 12' },
  ];

  // Initialize the images from base images
  useEffect(() => {
    // Start with more images for better initial load experience
    const initialImages = eventImages.length > 0
      ? eventImages.slice(0, 16).map((img, index) => ({
          id: `initial-${index}`,
          src: img.src || img.url,
          alt: img.alt || `Event image ${index + 1}`,
        }))
      : baseImages.map((img, index) => ({
          id: `initial-${index}`,
          src: img.src,
          alt: img.alt,
        }));
    
    setImages(initialImages);
    
    // Initialize loading state for each image
    const initialLoadingState = {};
    initialImages.forEach(img => {
      initialLoadingState[img.id] = true;
    });
    
    setLoadingImages(initialLoadingState);
  }, [eventImages]);

  // Distribute images into columns for masonry layout
  const distributeImages = (imageList) => {
    // For large screens (4 columns)
    const col1Large = [];
    const col2Large = [];
    const col3Large = [];
    const col4Large = [];
    
    // For small screens (2 columns)
    const col1Small = [];
    const col2Small = [];
    
    // Distribute images evenly among columns
    imageList.forEach((image, index) => {
      // For large screens (4 columns)
      if (index % 4 === 0) col1Large.push(image);
      else if (index % 4 === 1) col2Large.push(image);
      else if (index % 4 === 2) col3Large.push(image);
      else col4Large.push(image);
      
      // For small screens (2 columns)
      if (index % 2 === 0) col1Small.push(image);
      else col2Small.push(image);
    });
    
    return {
      largeColumns: [col1Large, col2Large, col3Large, col4Large],
      smallColumns: [col1Small, col2Small]
    };
  };

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreImages();
        }
      },
      { threshold: 0.3, rootMargin: "200px" }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [images, loadingMore]);

  const loadMoreImages = () => {
    setLoadingMore(true);
    
    // Preload images before adding them to the DOM
    const preloadImages = (imageList) => {
      const promises = imageList.map(img => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = img.src;
          image.onload = () => resolve(img);
          image.onerror = () => resolve(img); // Continue even if error
        });
      });
      return Promise.all(promises);
    };
    
    setTimeout(() => {
      // Generate the next batch of images
      const moreImages = eventImages.length > 0
        ? eventImages.slice(0, 8).map((img, index) => ({
            id: `page-${page}-${index}`,
            src: img.src || img.url,
            alt: img.alt || `Event image ${index + 1} (page ${page})`,
          }))
        : baseImages.slice(0, 8).map((img, index) => ({
            id: `page-${page}-${index}`,
            src: img.src,
            alt: `${img.alt} (page ${page})`,
          }));
      
      // Initialize loading state for new images
      const newLoadingState = { ...loadingImages };
      moreImages.forEach(img => {
        newLoadingState[img.id] = true;
      });
      
      // Preload images
      preloadImages(moreImages).then(() => {
        setLoadingImages(newLoadingState);
        setImages(prevImages => [...prevImages, ...moreImages]);
        setPage(prevPage => prevPage + 1);
        setLoadingMore(false);
      });
    }, 500);
  };

  const handleDownload = (src, alt) => {
    // Create an anchor element
    const link = document.createElement('a');
    link.href = src;
    link.download = `festclicks-${alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = (imageId) => {
    setLoadingImages(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  // Distribute images into columns
  const { largeColumns, smallColumns } = distributeImages(images);

  // Render skeleton or image based on loading state
  const renderImageOrSkeleton = (image, columnIndex) => {
    return (
      <div key={image.id} className="image-container">
        {loadingImages[image.id] && (
          <Skeleton 
            className="w-full" 
            style={{ 
              aspectRatio: Math.random() > 0.5 ? '3/4' : '4/3',
              marginTop: '8px',
              backgroundColor: '#131313'
            }} 
          />
        )}
        
        <motion.img
          src={image.src}
          alt={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: loadingImages[image.id] ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
          onLoad={() => handleImageLoad(image.id)}
          style={{ display: loadingImages[image.id] ? 'none' : 'block' }}
        />
        
        <div 
          className="download-icon"
          onClick={() => handleDownload(image.src, image.alt)}
          style={{ opacity: loadingImages[image.id] ? 0 : undefined }}
        >
          <Download size={20} className="text-white" />
        </div>
      </div>
    );
  };

  // The reviews data for the marquee
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Original Image Grid Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div 
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative group rounded-lg overflow-hidden bg-gray-900 h-64 flex items-center justify-center"
          >
            {loadingImages[image.id] && (
              <Skeleton className="absolute inset-0 bg-gray-800/40" />
            )}
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 ${
                loadingImages[image.id] ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => {
                setLoadingImages(prev => ({ ...prev, [image.id]: false }));
              }}
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button 
                  className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(image.src, '_blank');
                  }}
                >
                  <Download size={18} />
                </button>
              </div>
              <div className="text-white text-xs text-right">
                Request image removal: @contactadmin
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Loader indicator */}
      <div ref={loaderRef} className="h-20 flex items-center justify-center mt-8">
        {loadingMore && (
          <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* Vertical Marquee Demo */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reviews Marquee</h2>
        <MarqueeDemoVertical />
      </div>
    </div>
  );
};

export default ImageGrid; 