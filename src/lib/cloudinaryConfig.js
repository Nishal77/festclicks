import { Cloudinary } from '@cloudinary/url-gen';

// Create a Cloudinary instance with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true // Force HTTPS
  }
});

export default cld; 