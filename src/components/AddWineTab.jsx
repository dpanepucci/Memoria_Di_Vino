import { useState } from "react";
import "./AddWineTab.css";
import { saveWine } from "../utils/wineStorage";

function AddWineTab({ onWineSaved }) {
  // State to track the selected rating (0-5)
  const [rating, setRating] = useState(0);
  // State to track which star is being hovered (for visual feedback)
  const [hoverRating, setHoverRating] = useState(0);
  // State to store the uploaded photo preview URL
  const [photoPreview, setPhotoPreview] = useState(null);
  // State for form submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to compress and resize image
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // Calculate size reduction
          const originalSize = (e.target.result.length * 0.75) / 1024; // KB
          const compressedSize = (compressedBase64.length * 0.75) / 1024; // KB
          
          console.log(`Image compressed: ${originalSize.toFixed(2)}KB → ${compressedSize.toFixed(2)}KB`);
          
          resolve(compressedBase64);
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Function to handle photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    
    if (file) {
      // Check if it's an image
      if (file.type.startsWith('image/')) {
        try {
          // Compress the image before saving
          const compressedImage = await compressImage(file);
          setPhotoPreview(compressedImage);
        } catch (error) {
          console.error('Error compressing image:', error);
          alert('Error processing image. Please try a different photo.');
        }
      } else {
        alert('Please select an image file');
      }
    }
  };

  // Function to remove the uploaded photo
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    
    // Get form values
    const formData = new FormData(event.target);
    const wineName = formData.get('wine-name');
    const location = formData.get('wine-location');
    const notes = formData.get('wine-notes');
    
    // Validate required fields
    if (!wineName) {
      alert('Please fill in the wine name');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create wine object
    const wineData = {
      name: wineName,
      location: location || '',
      notes: notes || '',
      rating: rating,
      photo: photoPreview, // base64 image string
    };
    
    // Save to localStorage
    const result = saveWine(wineData);
    
    if (result.success) {
      alert('🍷 Wine added successfully!');
      
      // Reset form
      event.target.reset();
      setRating(0);
      setPhotoPreview(null);
      
      // Call parent callback if provided
      if (onWineSaved) {
        onWineSaved(result.wine);
      }
    } else {
      // Handle specific quota error
      if (result.error && result.error.includes('quota')) {
        alert('❌ Storage Full!\n\nYou\'ve reached your storage limit. Try:\n• Delete some old wines\n• Use photos without uploading (or smaller photos)\n• Contact support for cloud storage options');
      } else {
        alert('Error saving wine: ' + result.error);
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="add-wine-tab">
      <h2>Add New Wine</h2>
      <form onSubmit={handleSubmit}>
        {/* Photo Upload Section */}
        <div className="form-group photo-upload-section">
          <label>Wine Bottle Photo</label>
          
          {photoPreview ? (
            // Show the uploaded photo with remove button
            <div className="photo-preview-container">
              <img 
                src={photoPreview} 
                alt="Wine bottle preview" 
                className="wine-photo-preview"
              />
              <button 
                type="button" 
                onClick={handleRemovePhoto}
                className="remove-photo-btn"
              >
                ✕ Remove Photo
              </button>
            </div>
          ) : (
            // Show upload button when no photo
            <div className="photo-upload-placeholder">
              <label htmlFor="photo-upload" className="upload-label">
                <div className="upload-icon">📷</div>
                <span>Tap to upload photo</span>
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="photo-input"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="wine-name">Name of Wine *</label>
          <input 
            type="text" 
            id="wine-name" 
            name="wine-name"
            placeholder="Enter wine name" 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wine-location">Location of Purchase</label>
          <input 
            type="text" 
            id="wine-location" 
            name="wine-location"
            placeholder="e.g., Local Wine Shop, Costco, Restaurant" 
          />
        </div>

        {/* Star Rating Section */}
        <div className="form-group">
          <label>5 Star Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          <p className="rating-text">
            {rating > 0 ? `${rating} out of 5 stars` : 'Tap to rate'}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="wine-notes">Notes</label>
          <textarea 
            id="wine-notes" 
            name="wine-notes"
            placeholder="Add any notes about this wine..."
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          className="submit-wine-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : '🍷 Add Wine'}
        </button>
      </form>
    </div>
  );
}

export default AddWineTab;