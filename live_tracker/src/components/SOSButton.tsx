import { useState } from 'react'; // Fix 1: More specific import
import { useLocation } from '../hooks/useLocation';
import './SOSButton.css';
import { API_URL } from '../config';
const SOSButton = () => {
    const { latitude, longitude } = useLocation();
    const [isAlertSent, setIsAlertSent] = useState(false);
    const [error, setError] = useState('');

    const handleSOSClick = async () => {
        setError(''); // Clear previous errors
        if (!latitude || !longitude) {
            alert('Could not get your location. Please ensure location services are enabled.');
            return;
        }

        if (!window.confirm("Are you sure you want to send an SOS alert? This will contact emergency services.")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/sos/trigger`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude,
                    longitude,
                    userId: 'testUser123'
                })
            });

            if (!response.ok) {
                // Try to get a more specific error from the server
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send alert. Please try again.');
            }

            setIsAlertSent(true);
            alert('SOS Alert Sent! Help is on the way.');

        } catch (err: any) {
            setError(err.message); // Set the error state
            // No need for an alert here, as the error will be displayed on screen
        }
    };

    if (isAlertSent) {
        return <div className="sos-sent">Alert Sent</div>;
    }

    return (
        <div className="sos-container">
            <button className="sos-button" onClick={handleSOSClick}>
                SOS
            </button>
            {/* Fix 2: Display the error message if it exists */}
            {error && <p className="sos-error">{error}</p>}
        </div>
    );
};

export default SOSButton;