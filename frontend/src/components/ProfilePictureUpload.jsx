/**
 * Profile Picture Upload Component
 * Allows users to upload/change their profile picture with confirmation
 */
import { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUpload, FiX, FiCheck } from 'react-icons/fi';

const ProfilePictureUpload = ({ currentImage, onUpload, loading }) => {
  const [preview, setPreview] = useState(currentImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Update preview when currentImage changes (after successful upload or page load)
  useEffect(() => {
    console.log('ProfilePictureUpload: currentImage changed to:', currentImage);
    setPreview(currentImage);
    setSelectedFile(null); // Clear selected file after successful upload
  }, [currentImage]);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Store the file for later upload
    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setPreview(currentImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Picture Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
          {preview ? (
            <img 
              src={preview} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
              <FiCamera className="text-white text-4xl" />
            </div>
          )}
        </div>
        
        {/* Upload Button Overlay */}
        <button
          onClick={handleClick}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <FiCamera className="text-white text-3xl" />
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
        
        <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          {loading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, JPEG up to 5MB
        </p>
      </div>

      {/* Action Buttons - Show only when file is selected */}
      {selectedFile && !loading && (
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={handleSaveClick}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            <FiCheck className="mr-2" />
            Save Picture
          </button>
          <button
            onClick={handleCancelClick}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors shadow-md"
          >
            <FiX className="mr-2" />
            Cancel
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center max-w-xs space-y-2">
        {!selectedFile && !loading && (
          <p className="text-xs text-gray-500">
            Your profile picture will be visible to doctors and other users
          </p>
        )}
        {selectedFile && !loading && (
          <p className="text-xs text-blue-600 font-semibold">
            Click "Save Picture" to confirm your selection
          </p>
        )}
        {loading && (
          <p className="text-xs text-primary-600 font-semibold animate-pulse">
            Saving your picture...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
