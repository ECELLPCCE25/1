// Add this to your imports

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './maps.css';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

// Add this to your tab options in SafetyEmpowermentApp
{activeTab === 'location' && <LocationPage />}

// Create this new component
function LocationPage() {
  const [position, setPosition] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [contacts, setContacts] = useState([
    { id: 1, name: "Mom", phone: "+1234567890", isShared: false },
    { id: 2, name: "Lisa (Roommate)", phone: "+1234567891", isShared: false },
    { id: 3, name: "John (Friend)", phone: "+1234567892", isShared: false }
  ]);
  const [duration, setDuration] = useState(2); // hours
  const [error, setError] = useState(null);

  // Get current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsSharing(true);
    setError(null);
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        setError(err.message);
        setIsSharing(false);
      },
      { enableHighAccuracy: true }
    );

    // Watch for position changes
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        setError(err.message);
        setIsSharing(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  // Stop sharing location
  const stopSharing = () => {
    setIsSharing(false);
    setPosition(null);
  };

  // Toggle sharing with a contact
  const toggleContactShare = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isShared: !contact.isShared } : contact
    ));
  };

  // Send location to selected contacts
  const shareLocation = async () => {
    const selectedContacts = contacts.filter(c => c.isShared);
    
    if (selectedContacts.length === 0) {
      setError("Please select at least one contact");
      return;
    }

    try {
      // In a real app, you would send this to your backend API
      const response = await mockSendLocation({
        position,
        contacts: selectedContacts,
        duration
      });
      
      alert(`Location shared with ${selectedContacts.length} contacts for ${duration} hours`);
    } catch (err) {
      setError("Failed to share location. Please try again.");
    }
  };

  // Mock API function
  const mockSendLocation = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Location shared:", data);
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <div className="location-page">
      <h2>Location Sharing</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="location-controls">
        {!isSharing ? (
          <button onClick={getLocation} className="share-button">
            Start Sharing My Location
          </button>
        ) : (
          <button onClick={stopSharing} className="stop-button">
            Stop Sharing
          </button>
        )}
      </div>
      
      {position && (
        <div className="map-container">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>Your current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
      
      <div className="share-options">
        <h3>Share With Contacts</h3>
        
        <div className="duration-selector">
          <label>Duration:</label>
          <select 
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
            <option value={4}>4 hours</option>
            <option value={8}>8 hours</option>
            <option value={24}>24 hours</option>
          </select>
        </div>
        
        <div className="contact-list">
          {contacts.map(contact => (
            <div key={contact.id} className="contact-item">
              <label>
                <input
                  type="checkbox"
                  checked={contact.isShared}
                  onChange={() => toggleContactShare(contact.id)}
                  disabled={!isSharing}
                />
                {contact.name} ({contact.phone})
              </label>
            </div>
          ))}
        </div>
        
        <button 
          onClick={shareLocation}
          disabled={!isSharing}
          className="confirm-share-button"
        >
          Confirm Sharing
        </button>
      </div>
    </div>
  );
}