import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById, fetchMediaByEventId } from '../../services/supabaseClient';
import { getTransformedUrl, getTransformedVideoUrl } from '../../services/cloudinaryService';
import { useAuth } from '../../context/AuthContext';
import Upload from '../../components/shared/Upload';

const Gallery = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'images', 'videos'

  // Fetch event and media data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event details
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
        
        // Fetch media for this event
        const mediaData = await fetchMediaByEventId(eventId);
        setMedia(mediaData);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  // Handle upload complete
  const handleUploadComplete = (newMedia) => {
    setMedia(prevMedia => [...newMedia, ...prevMedia]);
    setShowUploadModal(false);
  };

  // Filter media by type
  const filteredMedia = media.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.resource_type === 'image';
    if (filter === 'videos') return item.resource_type === 'video';
    return true;
  });

  // Open media in fullscreen modal
  const openMedia = (media) => {
    setSelectedMedia(media);
  };

  // Close fullscreen modal
  const closeMedia = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-xl mb-4">Event not found</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
        <p className="text-gray-600 mt-2">{event.description}</p>
        <div className="flex items-center mt-4">
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{event.location}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('images')}
            className={`px-4 py-2 rounded-md text-sm ${
              filter === 'images'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilter('videos')}
            className={`px-4 py-2 rounded-md text-sm ${
              filter === 'videos'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Videos
          </button>
        </div>

        {/* Upload button (visible only to admins) */}
        {isAdmin && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Upload Media
          </button>
        )}
      </div>

      {/* Gallery grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No media found for this event.</p>
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Media
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openMedia(item)}
            >
              {item.resource_type === 'image' ? (
                <img
                  src={getTransformedUrl(item.public_id, { width: 400, height: 300 })}
                  alt={`Event media ${item.id}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-full h-64">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white opacity-80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upload Media</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <Upload eventId={eventId} onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </div>
      )}

      {/* Media viewer modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeMedia}
        >
          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col">
            <button
              onClick={closeMedia}
              className="self-end text-white mb-2"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.resource_type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt="Full size media"
                  className="max-w-full max-h-[80vh] mx-auto"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  className="max-w-full max-h-[80vh] mx-auto"
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 