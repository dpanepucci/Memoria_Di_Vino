// Utility functions for managing wine data in localStorage

const STORAGE_KEY = 'memoria_di_vino_wines';

// Get all wines from localStorage
export const getAllWines = () => {
  try {
    const wines = localStorage.getItem(STORAGE_KEY);
    return wines ? JSON.parse(wines) : [];
  } catch (error) {
    console.error('Error getting wines:', error);
    return [];
  }
};

// Save a new wine to localStorage
export const saveWine = (wineData) => {
  try {
    const wines = getAllWines();
    
    // Create new wine object with unique ID and timestamp
    const newWine = {
      id: Date.now(), // Simple unique ID based on timestamp
      ...wineData,
      dateAdded: new Date().toISOString(),
    };
    
    // Add to beginning of array (newest first)
    wines.unshift(newWine);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
    
    return { success: true, wine: newWine };
  } catch (error) {
    console.error('Error saving wine:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing wine
export const updateWine = (id, updatedData) => {
  try {
    const wines = getAllWines();
    const index = wines.findIndex(wine => wine.id === id);
    
    if (index !== -1) {
      wines[index] = { ...wines[index], ...updatedData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
      return { success: true, wine: wines[index] };
    }
    
    return { success: false, error: 'Wine not found' };
  } catch (error) {
    console.error('Error updating wine:', error);
    return { success: false, error: error.message };
  }
};

// Delete a wine by ID
export const deleteWine = (id) => {
  try {
    const wines = getAllWines();
    const filteredWines = wines.filter(wine => wine.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWines));
    return { success: true };
  } catch (error) {
    console.error('Error deleting wine:', error);
    return { success: false, error: error.message };
  }
};

// Get a single wine by ID
export const getWineById = (id) => {
  const wines = getAllWines();
  return wines.find(wine => wine.id === id);
};

// Clear all wines (useful for testing)
export const clearAllWines = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing wines:', error);
    return { success: false, error: error.message };
  }
};

// Get storage statistics
export const getStorageStats = () => {
  const wines = getAllWines();
  const storageData = localStorage.getItem(STORAGE_KEY) || '[]';
  const sizeInBytes = new Blob([storageData]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  
  return {
    totalWines: wines.length,
    storageSize: `${sizeInKB} KB`,
    wines: wines,
  };
};
