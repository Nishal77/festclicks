// Cloudinary service for handling media uploads
import cld from '@/lib/cloudinaryConfig';
import { fill } from '@cloudinary/url-gen/actions/resize';

// Access environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.CLOUDINARY_API_KEY;

// Base URL for Cloudinary uploads
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (e.g., 'events/123')
 * @param {string} resourceType - The type of resource ('image' or 'video')
 * @returns {Promise<Object>} - The Cloudinary response
 */
export const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
  
  // Only add API key if we're using signed uploads
  if (CLOUDINARY_API_KEY) {
    formData.append('api_key', CLOUDINARY_API_KEY);
  }
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`Cloudinary upload failed with status: ${response.status}`);
      }
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      publicId: data.public_id,
      url: data.secure_url,
      format: data.format,
      resourceType: data.resource_type,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      duration: data.duration, // For videos
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - The folder to upload to
 * @returns {Promise<Array>} - Array of Cloudinary responses
 */
export const uploadMultipleToCloudinary = async (files, folder) => {
  if (!files || !files.length) {
    throw new Error('No files provided for upload');
  }

  const uploadPromises = Array.from(files).map(file => {
    // Determine resource type based on file mime type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    return uploadToCloudinary(file, folder, resourceType);
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a Cloudinary URL with transformations using the URL-gen SDK
 * @param {string} publicId - The public ID of the resource
 * @param {Object} options - Transformation options
 * @returns {string} - The transformed URL
 */
export const getTransformedUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;
  
  // Create a new image with the public ID
  const image = cld.image(publicId);
  
  // Add transformations
  if (width && height) {
    image.resize(fill().width(width).height(height));
  }
  
  // Format and quality are automatically handled by the SDK
  
  return image.toURL();
};

/**
 * Generate a Cloudinary video URL with transformations
 * @param {string} publicId - The public ID of the video
 * @param {Object} options - Transformation options
 * @returns {string} - The transformed video URL
 */
export const getTransformedVideoUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  // Use the cloudinary SDK for videos too
  const video = cld.video(publicId);
  
  const {
    width,
    height,
    crop = 'fill',
  } = options;
  
  // Add transformations
  if (width && height) {
    video.resize(fill().width(width).height(height));
  }
  
  return video.toURL();
}; 