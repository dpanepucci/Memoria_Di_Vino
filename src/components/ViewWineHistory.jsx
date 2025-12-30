import { useState, useEffect } from "react";
import "./ViewWineHistory.css";
import { getAllWines, deleteWine } from "../utils/wineStorage";
import { getStorageInfo } from "../utils/storageInfo";

function ViewWineHistory() {
    const [wines, setWines] = useState([]);
    const [storageInfo, setStorageInfo] = useState(null);

    // Load wines when component mounts
    useEffect(() => {
        loadWines();
        loadStorageInfo();
    }, []);

    // Function to load all wines from localStorage
    const loadWines = () => {
        const allWines = getAllWines();
        setWines(allWines);
    };

    // Function to load storage information
    const loadStorageInfo = () => {
        const info = getStorageInfo();
        setStorageInfo(info);
    };

    // Function to handle deleting a wine
    const handleDelete = (id, wineName) => {
        if (window.confirm(`Are you sure you want to delete "${wineName}"?`)) {
            const result = deleteWine(id);
            if (result.success) {
                loadWines(); // Reload the list
                loadStorageInfo(); // Refresh storage info
                alert('Wine deleted successfully!');
            } else {
                alert('Error deleting wine: ' + result.error);
            }
        }
    };

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Function to render star rating
    const renderStars = (rating) => {
        return (
            <div className="wine-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'filled' : ''}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="view-wine-history">
            <h2>My Wine Collection</h2>
            
            {/* Storage Info Bar */}
            {storageInfo && (
                <div className={`storage-info ${parseFloat(storageInfo.percentUsed) > 80 ? 'warning' : ''}`}>
                    <div className="storage-text">
                        Storage: {storageInfo.usedMB}MB / {storageInfo.limitMB}MB ({storageInfo.percentUsed}%)
                    </div>
                    <div className="storage-bar">
                        <div 
                            className="storage-bar-fill" 
                            style={{ width: `${storageInfo.percentUsed}%` }}
                        />
                    </div>
                    {parseFloat(storageInfo.percentUsed) > 80 && (
                        <div className="storage-warning">
                            ⚠️ Storage almost full! Delete old wines or reduce photo sizes.
                        </div>
                    )}
                </div>
            )}
            
            {wines.length === 0 ? (
                <div className="no-wines">
                    <p>No wines added yet</p>
                    <p>Start tracking your wine journey!</p>
                </div>
            ) : (
                <>
                    <div className="wine-count">
                        Total Wines: {wines.length}
                    </div>
                    <div className="wine-list">
                        {wines.map((wine) => (
                            <div key={wine.id} className="wine-item">
                                {wine.photo && (
                                    <img 
                                        src={wine.photo} 
                                        alt={wine.name}
                                        className="wine-item-photo"
                                    />
                                )}
                                
                                <div className="wine-item-content">
                                    <h3>{wine.name}</h3>
                                    
                                    <div className="wine-detail">
                                        <span className="wine-type">{wine.type}</span>
                                        {wine.vintage && <span>• {wine.vintage}</span>}
                                    </div>
                                    
                                    {wine.region && (
                                        <div className="wine-detail">
                                            <strong>Region:</strong> {wine.region}
                                        </div>
                                    )}
                                    
                                    {wine.rating > 0 && (
                                        <div className="wine-detail">
                                            <strong>Rating:</strong> {renderStars(wine.rating)}
                                        </div>
                                    )}
                                    
                                    {wine.notes && (
                                        <div className="wine-notes">
                                            <strong>Notes:</strong>
                                            <p>{wine.notes}</p>
                                        </div>
                                    )}
                                    
                                    <div className="wine-footer">
                                        <span className="wine-date">
                                            Added: {formatDate(wine.dateAdded)}
                                        </span>
                                        <button 
                                            onClick={() => handleDelete(wine.id, wine.name)}
                                            className="delete-wine-btn"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ViewWineHistory;