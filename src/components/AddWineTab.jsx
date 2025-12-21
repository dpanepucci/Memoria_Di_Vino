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

  // Function to handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    
    if (file) {
      // Check if it's an image
      if (file.type.startsWith('image/')) {
        // Create a URL for the image to display as preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result); // Save the image data
        };
        reader.readAsDataURL(file); // Read the file as data URL
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
    const wineType = formData.get('wine-type');
    const wineVintage = formData.get('wine-vintage');
    const wineRegion = formData.get('wine-region');
    const wineNotes = formData.get('wine-notes');
    
    // Validate required fields
    if (!wineName || !wineType) {
      alert('Please fill in at least the wine name and type');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create wine object
    const wineData = {
      name: wineName,
      type: wineType,
      vintage: wineVintage || '',
      region: wineRegion || '',
      notes: wineNotes || '',
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
      alert('Error saving wine: ' + result.error);
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
          <label htmlFor="wine-name">Name *</label>
          <input 
            type="text" 
            id="wine-name" 
            name="wine-name"
            placeholder="Enter wine name" 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wine-type">Type *</label>
          <select id="wine-type" name="wine-type" required>
            <option value="">Select type</option>
            <option value="red">Red</option>
            <option value="white">White</option>
            <option value="rose">Rosé</option>
            <option value="sparkling">Sparkling</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="wine-vintage">Vintage (Year)</label>
          <input 
            type="number" 
            id="wine-vintage" 
            name="wine-vintage"
            placeholder="e.g., 2020" 
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="wine-region">Region</label>
          <input 
            type="text" 
            id="wine-region" 
            name="wine-region"
            placeholder="e.g., Tuscany, Napa Valley" 
          />
        </div>

        {/* Star Rating Section */}
        <div className="form-group">
          <label>Rating</label>
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
          <label htmlFor="wine-notes">Tasting Notes</label>
          <textarea 
            id="wine-notes" 
            name="wine-notes"
            placeholder="Describe the wine... flavors, aromas, occasion, etc."
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