import { useState, useRef } from 'react';
import { X, Upload, FileImage, Video, File, Check, AlertCircle, Info } from 'lucide-react';
import { Button } from './button';

const UploadModal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Categories for the dropdown
  const categories = [
    'Singing',
    'Dancing',
    'Photography',
    'Art',
    'Sports',
    'Fashion',
    'Technology',
    'Cultural',
    'Academic',
    'Other'
  ];

  // Media types for the radio buttons
  const mediaTypes = [
    { value: 'images', label: 'Images', description: 'Upload photos, graphics, or artwork (JPG, PNG, etc.)' },
    { value: 'videos', label: 'Videos', description: 'Upload video clips or recordings (MP4, MOV, etc.)' }
  ];

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  // Handle files from drag and drop or file input
  const handleFiles = (selectedFiles) => {
    // Clear previous errors
    setError('');
    
    // Validate file count
    if (files.length + selectedFiles.length > 100) {
      setError('You can only upload up to 100 files at once');
      return;
    }

    // Validate media type selection
    if (!mediaType) {
      setError('Please select a media type (Images or Videos) before uploading files');
      return;
    }

    // Validate file types based on media type
    if (mediaType === 'images') {
      // Filter for image files
      const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
      const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
      
      if (invalidFiles.length > 0) {
        setError(`${invalidFiles.length} file(s) were rejected because they are not images. Please select only image files when "Images" is selected as media type.`);
        // Still add the valid files if there are any
        if (validFiles.length > 0) {
          setFiles(prev => [...prev, ...validFiles]);
        }
        return;
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    } else if (mediaType === 'videos') {
      // Filter for video files
      const validFiles = selectedFiles.filter(file => file.type.startsWith('video/'));
      const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('video/'));
      
      if (invalidFiles.length > 0) {
        setError(`${invalidFiles.length} file(s) were rejected because they are not videos. Please select only video files when "Videos" is selected as media type.`);
        // Still add the valid files if there are any
        if (validFiles.length > 0) {
          setFiles(prev => [...prev, ...validFiles]);
        }
        return;
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Clear all selected files
  const clearAllFiles = () => {
    setFiles([]);
  };

  // Mock upload function
  const handleUpload = () => {
    // Validate inputs
    if (!category) {
      setError('Please select a category. This field is required.');
      return;
    }
    
    if (!mediaType) {
      setError('Please select a media type (Images or Videos). This field is required.');
      return;
    }
    
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    // Double check file types match selected media type
    if (mediaType === 'images') {
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setError('Some files in your selection are not images. Please remove them before uploading.');
        return;
      }
    } else if (mediaType === 'videos') {
      const invalidFiles = files.filter(file => !file.type.startsWith('video/'));
      if (invalidFiles.length > 0) {
        setError('Some files in your selection are not videos. Please remove them before uploading.');
        return;
      }
    }

    // Clear previous errors
    setError('');
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setSuccess(true);
        
        // Reset after showing success message
        setTimeout(() => {
          setFiles([]);
          setCategory('');
          setMediaType('');
          setUploadProgress(0);
          setSuccess(false);
          onClose();
        }, 2000);
      }
    }, 100);
  };

  // If not open, don't render
  if (!isOpen) return null;

  // Determine if the form is valid for submission
  const isFormValid = category && mediaType && files.length > 0 && !uploading;

  // Get file type icon
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get file size in human readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-[#101010] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-800 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40">
          <h2 className="text-xl font-bold text-white font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>UPLOAD MEDIA</h2>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Disclaimer */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-md flex items-start">
            <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-400 font-medium mb-1 font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>IMPORTANT INFORMATION</h3>
              <p className="text-gray-300 text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Please select the appropriate media type before uploading files. The system will automatically validate your files to ensure they match the selected type. For security reasons, images and videos must be uploaded separately, and you cannot mix different media types in a single upload.
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-5 p-4 bg-green-900/20 border border-green-800 rounded-md flex items-start">
              <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-200 text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Files uploaded successfully!</p>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Uploading...</span>
                <span className="text-sm text-gray-300 font-medium font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div>
              {/* Category dropdown */}
              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  CATEGORY 
                  <span className="text-red-400 ml-1">*</span>
                  <span className="ml-1 text-xs text-gray-500 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>(Required)</span>
                </label>
                <p className="text-gray-400 text-xs mb-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Select the most appropriate category for your media files
                </p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 rounded-md bg-gray-900 border ${
                    category ? 'border-gray-700' : 'border-red-900'
                  } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-sans`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Media type radio buttons */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  MEDIA TYPE
                  <span className="text-red-400 ml-1">*</span>
                  <span className="ml-1 text-xs text-gray-500 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>(Required)</span>
                </label>
                <p className="text-gray-400 text-xs mb-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Choose what type of files you're uploading
                </p>

                {/* Radio buttons for media type selection */}
                <div className="space-y-3 mt-3">
                  {mediaTypes.map((type) => (
                    <div 
                      key={type.value}
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        mediaType === type.value 
                          ? 'bg-blue-900/20 border-blue-500' 
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setMediaType(type.value)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          mediaType === type.value ? 'border-blue-500' : 'border-gray-600'
                        }`}>
                          {mediaType === type.value && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{type.label}</h4>
                          <p className="text-gray-400 text-sm mt-1 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File stats */}
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-blue-400">{files.length}</span> files selected 
                    <span className="text-gray-500"> (max 100)</span>
                  </p>
                  {files.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="text-xs text-red-400 hover:text-red-300 py-1"
                      onClick={clearAllFiles}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - File Upload */}
            <div>
              {/* File upload area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 mb-5 text-center ${
                  dragging 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : files.length > 0 
                      ? 'border-green-700 bg-green-900/10' 
                      : 'border-gray-700 bg-gray-900/50'
                } transition-colors duration-200 flex flex-col items-center justify-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ minHeight: '200px' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />

                {files.length > 0 ? (
                  <>
                    <Upload className="h-10 w-10 text-green-400 mb-3" />
                    <h4 className="text-lg font-medium text-white mb-1 font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>FILES SELECTED</h4>
                    <p className="text-green-400 text-sm mb-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{files.length} file{files.length !== 1 ? 's' : ''} ready to upload</p>
                    <p className="text-gray-400 text-xs font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Click or drag to add more files</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-blue-400 mb-3" />
                    <h4 className="text-lg font-medium text-white mb-1 font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>UPLOAD FILES</h4>
                    <p className="text-gray-400 text-sm mb-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Click to browse or drag and drop</p>
                    <p className="text-gray-500 text-xs font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>Max 100 files, each up to 50MB</p>
                  </>
                )}
              </div>

              {/* Selected files list */}
              {files.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SELECTED FILES</h4>
                    <button 
                      onClick={clearAllFiles} 
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors font-sans"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-md border border-gray-800 max-h-48 overflow-y-auto">
                    <ul className="divide-y divide-gray-800">
                      {files.map((file, index) => (
                        <li key={index} className="px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center">
                            {getFileIcon(file)}
                            <div className="ml-3">
                              <p className="text-sm text-white truncate max-w-[180px] font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="mt-6 text-xs text-gray-500 border-t border-gray-800 pt-4 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
            By uploading files, you confirm that you have permission to share this content and that it doesn't violate our <a href="#" className="text-blue-400 hover:underline">Community Guidelines</a> or <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>.
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 bg-black/30 px-6 py-4 flex justify-between items-center">
          <div className="text-gray-400 text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {files.length > 0 ? `${files.length} file${files.length === 1 ? '' : 's'} selected` : 'No files selected'}
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800 font-sans"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!files.length || !category || !mediaType || uploading}
              className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-all ${
                (!files.length || !category || !mediaType || uploading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              } font-heading`}
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              <Upload className="h-4 w-4 mr-2" />
              UPLOAD {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 