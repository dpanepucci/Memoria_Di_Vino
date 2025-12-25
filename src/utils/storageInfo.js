// Utility to calculate storage usage

export const getStorageInfo = () => {
  try {
    // Get all wines data
    const winesData = localStorage.getItem('memoria_di_vino_wines') || '[]';
    const usedBytes = new Blob([winesData]).size;
    const usedKB = usedBytes / 1024;
    const usedMB = usedKB / 1024;
    
    // Estimate localStorage limit (usually 5-10MB, we'll use 5MB as conservative)
    const limitMB = 5;
    const percentUsed = (usedMB / limitMB) * 100;
    
    const wines = JSON.parse(winesData);
    
    return {
      usedBytes,
      usedKB: usedKB.toFixed(2),
      usedMB: usedMB.toFixed(2),
      limitMB,
      percentUsed: Math.min(percentUsed, 100).toFixed(1),
      totalWines: wines.length,
      averageSizeKB: wines.length > 0 ? (usedKB / wines.length).toFixed(2) : 0,
    };
  } catch (error) {
    console.error('Error calculating storage:', error);
    return null;
  }
};

export const isStorageNearLimit = () => {
  const info = getStorageInfo();
  return info && parseFloat(info.percentUsed) > 80;
};
