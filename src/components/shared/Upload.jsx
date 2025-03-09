import { useState, useRef } from 'react';
import { uploadMultipleToCloudinary } from '../../services/cloudinaryService';
import { saveMediaRecord } from '../../services/supabaseClient';

const Upload = ({ eventId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setError(null);
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clear selected files
  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!files.length) {
      setError('Please select files to upload');
      return;
    }

    if (!eventId) {
      setError('Event ID is required for upload');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload files to Cloudinary
      const folder = `events/${eventId}`;
      const uploadedFiles = await uploadMultipleToCloudinary(files, folder);
      
      // Save media records to Supabase
      const mediaRecords = await Promise.all(
        uploadedFiles.map(async (file) => {
          const mediaData = {
            event_id: eventId,
            url: file.url,
            public_id: file.publicId,
            resource_type: file.resourceType,
            format: file.format,
            width: file.width,
            height: file.height,
            bytes: file.bytes,
            duration: file.duration || null,
          };
          
          return await saveMediaRecord(mediaData);
        })
      );
      
      // Clear files after successful upload
      clearFiles();
      
      // Call the onUploadComplete callback with the uploaded media records
      if (onUploadComplete) {
        onUploadComplete(mediaRecords);
      }
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  // Render file preview
  const renderFilePreview = () => {
    return files.map((file, index) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      return (
        <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 mb-2">
          <div className="flex items-center p-2">
            <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
              {isImage && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              )}
              {isVideo && (
                <video
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                />
              )}
              {!isImage && !isVideo && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xs text-gray-500">File</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          files.length ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/*,video/*"
        />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">Images and videos up to 100MB</p>
        </div>
      </div>

      {/* File preview */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2">{renderFilePreview()}</div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex space-x-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className={`px-4 py-2 rounded-md text-white ${
            !files.length || uploading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        
        {files.length > 0 && (
          <button
            type="button"
            onClick={clearFiles}
            disabled={uploading}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload; 