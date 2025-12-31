import { useState } from 'react';
import AddWineTab from './AddWineTab';
import './WineOptions.css';
import ViewWineHistory from './ViewWineHistory';


function WineOptions() {
    const [currentView, setCurrentView] = useState('menu'); // 'menu', 'add', 'view'
    const [refreshKey, setRefreshKey] = useState(0); // Key to force refresh

    // Callback when wine is saved
    const handleWineSaved = () => {
        setRefreshKey(prev => prev + 1); // Trigger refresh
        // Optionally auto-switch to view after adding
        // setCurrentView('view');
    };

    // If we're on the Add Wine view, show that component
    if (currentView === 'add') {
        return (
            <>
                <button onClick={() => setCurrentView('menu')} style={{ margin: '20px' }}>
                    ← Back to Menu
                </button>
                <AddWineTab onWineSaved={handleWineSaved} />
            </>
        );
    }

    // If we're on the View Wines view
    if (currentView === 'view') {
        return (
            <>
                <button onClick={() => setCurrentView('menu')} style={{ margin: '20px' }}>
                    ← Back to Menu
                </button>
                <ViewWineHistory key={refreshKey} />
            </>
        );
    }

    // Default: Show the menu
    return (
        <>
        <div className="wine-container">
            <button onClick={() => setCurrentView('add')} className="add-wine-button">
                Add New Wine
            </button>

            <button onClick={() => setCurrentView('view')} className="view-wine-button">
                View Wines
            </button>
            <img className='italy_outline_flag' src="../public/italy_outline_flag.png" alt="Italy Outline Flag" />
        </div>
        </>
    );
}

export default WineOptions;