import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="container mx-auto">
      {/* Custom CSS for masonry layout - matches the reference exactly */}
      <style>
        {`
          .grid-container {
            display: flex;
            flex-wrap: wrap;
            padding: 0 4px;
          }
          
          .column {
            flex: 25%;
            max-width: 25%;
            padding: 0 4px;
          }
          
          .column img {
            margin-top: 8px;
            vertical-align: middle;
            width: 100%;
            transition: all 0.3s ease;
          }
          
          .column img:hover {
            transform: scale(1.02);
          }
          
          .image-container {
            position: relative;
            overflow: hidden;
            margin-top: 8px;
          }
          
          .download-icon {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            padding: 8px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            border: 1px solid hsl(var(--border));
          }
          
          .image-container:hover .download-icon {
            opacity: 1;
          }
          
          @media (max-width: 1200px) {
            .column {
              flex: 50%;
              max-width: 50%;
            }
          }
          
          @media (max-width: 600px) {
            .column {
              flex: 100%;
              max-width: 100%;
            }
          }
        `}
      </style>

      <div className="grid-container">
        {/* First Column */}
        <div className="column">
          {largeColumns[0].map((image) => renderImageOrSkeleton(image, 0))}
        </div>
        
        {/* Second Column */}
        <div className="column">
          {largeColumns[1].map((image) => renderImageOrSkeleton(image, 1))}
        </div>
        
        {/* Third Column */}
        <div className="column">
          {largeColumns[2].map((image) => renderImageOrSkeleton(image, 2))}
        </div>
        
        {/* Fourth Column */}
        <div className="column">
          {largeColumns[3].map((image) => renderImageOrSkeleton(image, 3))}
        </div>
      </div>

      {/* Bottom loader for infinite scrolling - only visible when scrolling and loading more */}
      <div ref={loaderRef} className="w-full h-16 flex items-center justify-center py-4">
        {loadingMore && (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};

export default ImageGrid; 