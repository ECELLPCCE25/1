import { useState, useEffect, useRef } from 'react';
import './App.css';
import './styles.css';
import { 
  Shield, BookOpen, Users, Bell, Home, MessageCircle, User, Settings, 
  AlertTriangle, Search, Heart, TrendingUp, Briefcase, DollarSign, 
  Brain, Map, Navigation, Clock, X, ChevronRight, Plus, Check, Loader2
} from 'lucide-react';

// Mock API service (replace with real API calls in production)
const apiService = {
  async sendEmergencySMS(contacts, message, userLocation) {
    // In production, this would call your backend which uses Twilio
    console.log('Sending SMS to:', contacts);
    console.log('Message:', message);
    console.log('Location:', userLocation);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    return {
      success: true,
      message: 'Alerts sent successfully',
      responses: contacts.map(contact => ({
        contactId: contact.id,
        status: 'queued',
        sid: `SM${Math.random().toString(36).substring(2, 15)}`
      }))
    };
  },
  
  async getTrustedContacts() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 1, name: "Mom", phone: "+15551234567", status: "active" },
      { id: 2, name: "Lisa (Roommate)", phone: "+15559876543", status: "active" },
      { id: 3, name: "John (Friend)", phone: "+15555678901", status: "inactive" }
    ];
  },
  
  async getUserLocation() {
    // In production, use browser geolocation API
    return {
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY, USA",
      accuracy: 50
    };
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const contacts = await apiService.getTrustedContacts();
        setTrustedContacts(contacts.map(contact => ({
          ...contact,
          selected: contact.status === 'active'
        })));
      } catch (error) {
        console.error('Failed to load contacts:', error);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    
    loadContacts();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <h1 className="app-title">EmpowHer</h1>
        
        <div className="header-icons">
          <button 
            className="icon-button notification-button"
            onClick={() => setUnreadNotifications(0)}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>
          <button className="icon-button">
            <User size={20} />
          </button>
        </div>
      </header>
      
      {isMenuOpen && (
        <div className="side-menu">
          <div className="menu-header">
            <div className="user-profile">
              <div className="avatar">SA</div>
              <div>
                <h3>Sarah Anderson</h3>
                <p>Premium Member</p>
              </div>
            </div>
            <button 
              className="close-menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="menu-nav">
            <button 
              className="menu-item active"
              onClick={() => {
                setActiveTab('home');
                setIsMenuOpen(false);
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setActiveTab('safety');
                setIsMenuOpen(false);
              }}
            >
              <Shield size={18} />
              <span>Safety Center</span>
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setActiveTab('resources');
                setIsMenuOpen(false);
              }}
            >
              <BookOpen size={18} />
              <span>Resources</span>
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setActiveTab('community');
                setIsMenuOpen(false);
              }}
            >
              <Users size={18} />
              <span>Community</span>
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setActiveTab('profile');
                setIsMenuOpen(false);
              }}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
          
          <div className="menu-footer">
            <button className="menu-footer-item">
              <span>Help Center</span>
              <ChevronRight size={16} />
            </button>
            <button className="menu-footer-item">
              <span>Privacy Policy</span>
              <ChevronRight size={16} />
            </button>
            <button className="logout-button">
              Log Out
            </button>
          </div>
        </div>
      )}
      
      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage 
            setShowSOSModal={setShowSOSModal} 
            isActive={activeTab === 'home'}
            trustedContacts={trustedContacts}
            isLoadingContacts={isLoadingContacts}
          />
        )}
        {activeTab === 'safety' && (
          <SafetyPage isActive={activeTab === 'safety'} />
        )}
        {activeTab === 'resources' && (
          <ResourcesPage isActive={activeTab === 'resources'} />
        )}
        {activeTab === 'community' && (
          <CommunityPage isActive={activeTab === 'community'} />
        )}
        {activeTab === 'profile' && (
          <ProfilePage isActive={activeTab === 'profile'} />
        )}
      </main>
      
      <div className="sos-button-container">
        <button 
          onClick={() => setShowSOSModal(true)}
          className="sos-button pulse"
        >
          <span className="sos-text">SOS</span>
          <span className="sos-circle"></span>
        </button>
      </div>
      
      <nav className="bottom-nav">
        <div className="nav-buttons">
          <button 
            onClick={() => setActiveTab('home')}
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
          >
            <Home size={20} />
            <span className="nav-label">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('safety')}
            className={`nav-button ${activeTab === 'safety' ? 'active' : ''}`}
          >
            <Shield size={20} />
            <span className="nav-label">Safety</span>
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`nav-button ${activeTab === 'resources' ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            <span className="nav-label">Resources</span>
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            className={`nav-button ${activeTab === 'community' ? 'active' : ''}`}
          >
            <Users size={20} />
            <span className="nav-label">Community</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span className="nav-label">Settings</span>
          </button>
        </div>
      </nav>
      
      {showSOSModal && (
        <SOSModal 
          onClose={() => setShowSOSModal(false)}
          trustedContacts={trustedContacts.filter(c => c.selected)}
        />
      )}
    </div>
  );
}

function HomePage({ setShowSOSModal, isActive, trustedContacts, isLoadingContacts }) {
  const [safetyStatus, setSafetyStatus] = useState('safe');
  const [showLocationSharing, setShowLocationSharing] = useState(false);
  const [safetyTips] = useState([
    "Stay aware of your surroundings",
    "Keep your phone charged when out",
    "Share your location with trusted contacts",
    "Trust your instincts - if something feels wrong, it probably is",
    "Use well-lit and populated routes when possible"
  ]);
  const [currentTip, setCurrentTip] = useState(0);
  const [lastCheckin, setLastCheckin] = useState("2:30 PM");
  const [trendingResources] = useState([
    { id: 1, title: "Financial Independence Workshop", category: "Finance", views: 432 },
    { id: 2, title: "Self-Defense Basics", category: "Safety", views: 289 },
    { id: 3, title: "Negotiation Skills for Women", category: "Career", views: 567 }
  ]);
  const [shakeSOS, setShakeSOS] = useState(false);
  const [localContacts, setLocalContacts] = useState([]);
  
  useEffect(() => {
    setLocalContacts(trustedContacts.map(contact => ({
      ...contact,
      selected: contact.status === 'active'
    })));
  }, [trustedContacts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % safetyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [safetyTips.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShakeSOS(true);
      setTimeout(() => setShakeSOS(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    setLastCheckin(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSafetyStatus('safe');
  };

  const toggleContactSelection = (id) => {
    setLocalContacts(contacts => 
      contacts.map(contact => 
        contact.id === id 
          ? { ...contact, selected: !contact.selected } 
          : contact
      )
    );
  };

  const handleShareLocation = async () => {
    const selectedContacts = localContacts.filter(c => c.selected);
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact");
      return;
    }
    
    try {
      const location = await apiService.getUserLocation();
      const message = `I'm sharing my location with you via EmpowerSafe App. 
      My current location is approximately: ${location.address}. 
      Shared at ${new Date().toLocaleTimeString()}.`;
      
      const response = await apiService.sendEmergencySMS(
        selectedContacts,
        message,
        location
      );
      
      if (response.success) {
        alert(`Location shared successfully with ${selectedContacts.length} contacts!`);
        setShowLocationSharing(false);
      } else {
        alert("Failed to share location. Please try again.");
      }
    } catch (error) {
      console.error('Location sharing failed:', error);
      alert("An error occurred while sharing your location.");
    }
  };

  return (
    <div className={`home-page ${isActive ? 'active' : ''}`}>
      <div className="status-card">
        <div className="status-header">
          <h2>Welcome, Sarah</h2>
          <div className="status-indicator">
            <div className={`status-dot ${safetyStatus === 'safe' ? 'safe' : 'warning'}`}></div>
            <span>Status: {safetyStatus === 'safe' ? 'Safe' : 'Check-in needed'}</span>
          </div>
        </div>
        
        <div className="status-footer">
          <div>
            <p className="last-checkin">Last check-in: {lastCheckin}</p>
            <button 
              onClick={handleCheckIn}
              className="checkin-button hover-grow"
            >
              Check in now
            </button>
          </div>
          <div className="safety-tip">
            <p className="tip-label">Safety Tip:</p>
            <p className="tip-text">{safetyTips[currentTip]}</p>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <button 
          onClick={() => {
            setShowSOSModal(true);
            setShakeSOS(false);
          }}
          className={`action-button sos-action ${shakeSOS ? 'shake' : ''} hover-grow`}
        >
          <div className="action-icon sos-icon">
            <AlertTriangle size={24} />
          </div>
          <span>Emergency SOS</span>
        </button>
        
        <button 
          onClick={() => setShowLocationSharing(!showLocationSharing)}
          className="action-button location-action hover-grow"
        >
          <div className="action-icon location-icon">
            <Users size={24} />
          </div>
          <span>Share Location</span>
        </button>
        
        <button className="action-button resources-action hover-grow">
          <div className="action-icon resources-icon">
            <BookOpen size={24} />
          </div>
          <span>Resources</span>
        </button>
        
        <button className="action-button community-action hover-grow">
          <div className="action-icon community-icon">
            <MessageCircle size={24} />
          </div>
          <span>Community</span>
        </button>
      </div>
      
      {showLocationSharing && (
        <div className="location-sharing slide-up">
          <h3>Share Your Location</h3>
          
          {isLoadingContacts ? (
            <div className="loading-contacts">
              <Loader2 className="spinner" size={24} />
              <p>Loading your contacts...</p>
            </div>
          ) : (
            <>
              <div className="contact-list">
                {localContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`contact-item ${contact.selected ? 'selected' : ''}`}
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    <div className={`contact-status ${contact.status}`}></div>
                    {contact.name}
                    {contact.selected && <Check className="check-icon" size={16} />}
                  </div>
                ))}
                <button className="add-contact hover-grow">
                  <Plus size={16} />
                  Add Contact
                </button>
              </div>
              
              <div className="sharing-options">
                <button 
                  className="share-button primary hover-grow"
                  onClick={handleShareLocation}
                >
                  Share for 2 hours
                </button>
                <button className="share-button secondary hover-grow">
                  Custom Duration
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="trending-resources">
        <h3>Trending Resources</h3>
        <div className="resources-list">
          {trendingResources.map(resource => (
            <div 
              key={resource.id}
              className="resource-item hover-scale"
            >
              <div>
                <h4>{resource.title}</h4>
                <span className="resource-category">
                  {resource.category}
                </span>
              </div>
              <div className="resource-views">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {resource.views}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <ActivityItem 
            icon={<Heart size={16} className="heart-icon" />}
            title="New Mentor Match"
            description="You've been matched with Jessica, a marketing executive"
            time="2 hours ago"
          />
          <ActivityItem 
            icon={<AlertTriangle size={16} className="alert-icon" />}
            title="Safety Alert"
            description="New report in your neighborhood"
            time="Yesterday"
          />
          <ActivityItem 
            icon={<TrendingUp size={16} className="trend-icon" />}
            title="Financial Workshop"
            description="Investment Basics for Beginners starting soon"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
}

function SafetyPage({ isActive }) {
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [destinationInput, setDestinationInput] = useState("");
  const [safetyAlerts, setSafetyAlerts] = useState([
    { id: 1, type: "Medium Risk", location: "Oak Street & 7th Avenue", time: "20 min ago", color: "yellow" },
    { id: 2, type: "Low Risk", location: "Central Park West", time: "2 hours ago", color: "blue" }
  ]);
  const [mapZoom, setMapZoom] = useState(1);
  const [isReportingActive, setIsReportingActive] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routes] = useState([
    { id: 1, type: "safest", time: "22 min", alerts: 1 },
    { id: 2, type: "fastest", time: "15 min", alerts: 3 }
  ]);
  const [showAlertDetails, setShowAlertDetails] = useState(null);

  const zoomIn = () => setMapZoom(prev => Math.min(prev + 0.5, 3));
  const zoomOut = () => setMapZoom(prev => Math.max(prev - 0.5, 1));
  
  const addSafetyReport = () => {
    if (isReportingActive) {
      const newReport = {
        id: safetyAlerts.length + 1,
        type: "User Report",
        location: "Current Location",
        time: "Just now",
        color: "blue"
      };
      setSafetyAlerts([newReport, ...safetyAlerts]);
      setIsReportingActive(false);
    } else {
      setIsReportingActive(true);
    }
  };

  const handleRouteSelect = (id) => {
    setSelectedRoute(id);
  };

  const toggleAlertDetails = (id) => {
    setShowAlertDetails(showAlertDetails === id ? null : id);
  };

  return (
    <div className={`safety-page ${isActive ? 'active' : ''}`}>
      <h2>Safety Center</h2>
      
      <div className="safety-map-container">
        <div 
          className="safety-map" 
          style={{ backgroundSize: `${100 * mapZoom}%` }}
          onClick={() => {
            if (isReportingActive) {
              addSafetyReport();
            }
          }}
        >
          <div className="map-marker marker-1 pulse"></div>
          <div className="map-marker marker-2 pulse delay-1"></div>
          <div className="map-marker marker-3 pulse delay-2"></div>
          
          <div className="user-location pulse"></div>
          
          {isReportingActive && (
            <div className="reporting-indicator pulse"></div>
          )}
          
          {selectedRoute && (
            <div className={`route-overlay route-${selectedRoute}`}></div>
          )}
        </div>
        
        <div className="map-controls">
          <button onClick={zoomIn} className="hover-grow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button onClick={zoomOut} className="hover-grow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        <div className="report-button-container">
          <button 
            className={`report-button ${isReportingActive ? 'active' : ''} hover-grow`}
            onClick={addSafetyReport}
          >
            {isReportingActive ? 'Cancel' : 'Report'}
          </button>
        </div>
      </div>
      
      <div className="map-info">
        <h3>Safety Reports Near You</h3>
        <div className="safety-alerts">
          {safetyAlerts.map(alert => (
            <div key={alert.id}>
              <SafetyAlert 
                type={alert.type} 
                location={alert.location} 
                time={alert.time} 
                color={alert.color}
                onClick={() => toggleAlertDetails(alert.id)}
              />
              {showAlertDetails === alert.id && (
                <div className="alert-details slide-down">
                  <p>Reported by: {alert.type === "User Report" ? "You" : "Community Member"}</p>
                  <p>Details: {alert.type === "User Report" 
                    ? "You reported feeling unsafe in this area" 
                    : "Multiple reports of suspicious activity in this area"}</p>
                  <button className="small-button hover-grow">View on Map</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showRoutePlanner && (
        <div className="route-planner slide-up">
          <div className="route-planner-header">
            <h3>Safe Route Planner</h3>
            <button 
              onClick={() => {
                setShowRoutePlanner(false);
                setSelectedRoute(null);
              }}
              className="close-button hover-grow"
            >
              <X size={20} />
            </button>
          </div>
          <div className="route-planner-content">
            <div>
              <label>Current Location</label>
              <div className="current-location">
                <Navigation size={16} />
                <span>Current location</span>
              </div>
            </div>
            <div>
              <label>Destination</label>
              <div className="destination-input">
                <input 
                  type="text" 
                  placeholder="Enter destination"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                />
                <button 
                  disabled={!destinationInput.trim()}
                  className="hover-grow"
                >
                  Go
                </button>
              </div>
            </div>
            
            {destinationInput && (
              <div className="route-options">
                {routes.map(route => (
                  <button 
                    key={route.id}
                    className={`route-option ${selectedRoute === route.id ? 'selected' : ''} hover-grow`}
                    onClick={() => handleRouteSelect(route.id)}
                  >
                    {route.type === "safest" ? (
                      <Shield size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {route.type === "safest" ? "Safest" : "Fastest"}
                    <span className="route-time">{route.time}</span>
                    <span className="route-alerts">{route.alerts} alert{route.alerts !== 1 ? 's' : ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="safety-features">
        <h3>Safety Tools</h3>
        
        <div className="safety-tool hover-scale">
          <div className="tool-info">
            <div className="tool-icon">
              <Map size={20} />
            </div>
            <div>
              <h4>Safe Route Planner</h4>
              <p>Find the safest route to your destination</p>
            </div>
          </div>
          <button 
            onClick={() => setShowRoutePlanner(true)}
            className="hover-grow"
          >
            Open
          </button>
        </div>
        
        <div className="safety-tool hover-scale">
          <div className="tool-info">
            <div className="tool-icon">
              <Bell size={20} />
            </div>
            <div>
              <h4>Safety Check-in</h4>
              <p>Set automated check-ins during trips</p>
            </div>
          </div>
          <button className="hover-grow">Set Up</button>
        </div>
        
        <div className="safety-tool hover-scale">
          <div className="tool-info">
            <div className="tool-icon">
              <Users size={20} />
            </div>
            <div>
              <h4>Trusted Contacts</h4>
              <p>Manage your emergency contacts</p>
            </div>
          </div>
          <button className="hover-grow">Manage</button>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage({ isActive }) {
  const [activeCategory, setActiveCategory] = useState('career');
  const [expandedResource, setExpandedResource] = useState(null);
  const [savedResources, setSavedResources] = useState([1]);
  
  const careerResources = [
    { 
      id: 1, 
      title: "Resume Building Workshop", 
      type: "Webinar", 
      date: "May 5, 2025", 
      description: "Learn how to create a compelling resume that highlights your strengths",
      duration: "1 hour",
      instructor: "Jane Smith, HR Director",
      skills: ["Resume Writing", "Personal Branding"]
    },
    { 
      id: 2, 
      title: "Negotiation Skills for Women", 
      type: "Course", 
      date: "Self-paced", 
      description: "Master the art of negotiation in male-dominated industries",
      duration: "4 weeks",
      instructor: "Dr. Maria Gonzalez",
      skills: ["Negotiation", "Communication"]
    }
  ];
  
  const financeResources = [
    { 
      id: 3, 
      title: "Investment Fundamentals", 
      type: "Course", 
      date: "Self-paced", 
      description: "Build your financial knowledge from the ground up",
      duration: "6 weeks",
      instructor: "Financial Experts Team",
      skills: ["Investing", "Financial Planning"]
    }
  ];
  
  const mentalResources = [
    { 
      id: 4, 
      title: "Stress Management Techniques", 
      type: "Workshop", 
      date: "May 3, 2025", 
      description: "Practical techniques to manage daily stress",
      duration: "1.5 hours",
      instructor: "Dr. Lisa Chen",
      skills: ["Stress Reduction", "Mindfulness"]
    }
  ];

  const toggleResource = (id) => {
    setExpandedResource(expandedResource === id ? null : id);
  };

  const toggleSaveResource = (id, e) => {
    e.stopPropagation();
    setSavedResources(prev => 
      prev.includes(id) 
        ? prev.filter(resId => resId !== id) 
        : [...prev, id]
    );
  };

  const getResourcesByCategory = () => {
    switch(activeCategory) {
      case 'career': return careerResources;
      case 'finance': return financeResources;
      case 'mental': return mentalResources;
      default: return [];
    }
  };

  return (
    <div className={`resources-page ${isActive ? 'active' : ''}`}>
      <h2>Empowerment Resources</h2>
      
      <div className="resource-categories">
        <button 
          onClick={() => {
            setActiveCategory('career');
            setExpandedResource(null);
          }}
          className={`category-button ${activeCategory === 'career' ? 'active' : ''} hover-grow`}
        >
          <Briefcase size={16} />
          Career
        </button>
        <button 
          onClick={() => {
            setActiveCategory('finance');
            setExpandedResource(null);
          }}
          className={`category-button ${activeCategory === 'finance' ? 'active' : ''} hover-grow`}
        >
          <DollarSign size={16} />
          Financial
        </button>
        <button 
          onClick={() => {
            setActiveCategory('mental');
            setExpandedResource(null);
          }}
          className={`category-button ${activeCategory === 'mental' ? 'active' : ''} hover-grow`}
        >
          <Brain size={16} />
          Mental Health
        </button>
      </div>
      
      <div className="resources-list-container">
        {getResourcesByCategory().map(resource => (
          <div 
            key={resource.id}
            className={`resource-card ${expandedResource === resource.id ? 'expanded' : ''} hover-scale`}
            onClick={() => toggleResource(resource.id)}
          >
            <div className="resource-header">
              <h4>{resource.title}</h4>
              <div>
                <span className="resource-type">{resource.type}</span>
                <button 
                  className={`save-button ${savedResources.includes(resource.id) ? 'saved' : ''}`}
                  onClick={(e) => toggleSaveResource(resource.id, e)}
                >
                  <Heart 
                    size={16} 
                    fill={savedResources.includes(resource.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>
            <p>{resource.description}</p>
            
            {expandedResource === resource.id && (
              <div className="resource-details slide-down">
                <div className="detail-item">
                  <span>Duration:</span>
                  <span>{resource.duration}</span>
                </div>
                <div className="detail-item">
                  <span>Instructor:</span>
                  <span>{resource.instructor}</span>
                </div>
                <div className="detail-item">
                  <span>Skills Covered:</span>
                  <div className="skills">
                    {resource.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="resource-footer">
              <span>{resource.date}</span>
              <button className="hover-grow">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityPage({ isActive }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState([1]);
  const [rsvpEvents, setRsvpEvents] = useState([1]);
  const [showEventModal, setShowEventModal] = useState(null);
  
  const communities = [
    { id: 1, name: "Women in Tech", members: "2,450 members", color: "blue" },
    { id: 2, name: "Entrepreneurs", members: "1,283 members", color: "green" },
    { id: 3, name: "Financial Freedom", members: "3,712 members", color: "yellow" },
    { id: 4, name: "Wellness Circle", members: "943 members", color: "purple" }
  ];
  
  const events = [
    { 
      id: 1, 
      title: "Leadership Workshop", 
      date: "May 2, 2025 • 6:00 PM", 
      attendees: "43 attending",
      location: "Virtual",
      description: "Join us for an interactive workshop on leadership skills for women in the workplace. Learn from industry leaders and network with peers.",
      duration: "2 hours"
    },
    { 
      id: 2, 
      title: "Career Fair: Women in STEM", 
      date: "May 7, 2025 • 10:00 AM", 
      attendees: "128 attending",
      location: "Convention Center",
      description: "Connect with top employers looking to hire women in STEM fields. Bring your resume and be ready to network!",
      duration: "4 hours"
    }
  ];

  const toggleCommunityJoin = (id) => {
    setJoinedCommunities(prev => 
      prev.includes(id) 
        ? prev.filter(commId => commId !== id) 
        : [...prev, id]
    );
  };

  const toggleEventRSVP = (id) => {
    setRsvpEvents(prev => 
      prev.includes(id) 
        ? prev.filter(eventId => eventId !== id) 
        : [...prev, id]
    );
  };

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`community-page ${isActive ? 'active' : ''}`}>
      <h2>Community</h2>
      
      <div className="community-search">
        <input
          type="text"
          placeholder="Search communities, mentors, or events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" size={20} />
      </div>
      
      <div className="section">
        <h3>Featured Communities</h3>
        <div className="community-cards">
          {filteredCommunities.map(community => (
            <div 
              key={community.id} 
              className={`community-card ${community.color} ${joinedCommunities.includes(community.id) ? 'joined' : ''}`}
            >
              <h4>{community.name}</h4>
              <p>{community.members}</p>
              <button 
                className={`join-button ${community.color} hover-grow`}
                onClick={() => toggleCommunityJoin(community.id)}
              >
                {joinedCommunities.includes(community.id) ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h3>Upcoming Events</h3>
        <div className="event-cards">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card hover-scale">
              <h4>{event.title}</h4>
              <p>{event.date}</p>
              <div className="event-footer">
                <span>{event.attendees}</span>
                <div>
                  <button 
                    className="info-button hover-grow"
                    onClick={() => setShowEventModal(event)}
                  >
                    Info
                  </button>
                  <button 
                    className={`rsvp-button hover-grow ${rsvpEvents.includes(event.id) ? 'attending' : ''}`}
                    onClick={() => toggleEventRSVP(event.id)}
                  >
                    {rsvpEvents.includes(event.id) ? 'Attending' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mentorship-section">
        <div className="mentorship-header">
          <h3>Mentorship</h3>
          <button className="hover-grow">View All</button>
        </div>
        <div className="mentorship-card hover-scale">
          <h4>Find Your Mentor</h4>
          <p>Connect with experienced professionals in your field</p>
          <button className="mentorship-button hover-grow">Explore Mentors</button>
        </div>
      </div>
      
      {showEventModal && (
        <div className="event-modal-overlay">
          <div className="event-modal slide-up">
            <div className="modal-header">
              <h3>{showEventModal.title}</h3>
              <button 
                onClick={() => setShowEventModal(null)}
                className="close-button hover-grow"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-item">
                <span>Date:</span>
                <span>{showEventModal.date}</span>
              </div>
              <div className="detail-item">
                <span>Location:</span>
                <span>{showEventModal.location}</span>
              </div>
              <div className="detail-item">
                <span>Duration:</span>
                <span>{showEventModal.duration}</span>
              </div>
              <div className="detail-item full-width">
                <span>Description:</span>
                <p>{showEventModal.description}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className={`rsvp-button large ${rsvpEvents.includes(showEventModal.id) ? 'attending' : ''} hover-grow`}
                onClick={() => {
                  toggleEventRSVP(showEventModal.id);
                  setShowEventModal(null);
                }}
              >
                {rsvpEvents.includes(showEventModal.id) ? 'Cancel RSVP' : 'RSVP Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePage({ isActive }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('privacy');
  const [locationSharing, setLocationSharing] = useState('limited');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Sarah Anderson",
    email: "sarah.anderson@example.com",
    bio: "Safety advocate and women's empowerment enthusiast",
    phone: "+1 (555) 123-4567"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setShowEditProfile(false);
  };

  return (
    <div className={`profile-page ${isActive ? 'active' : ''}`}>
      <h2>Settings</h2>
      
      <div className="profile-section">
        <div className="profile-info">
          <div className="profile-avatar">
            <span>SA</span>
          </div>
          <div>
            <h3>{profileData.name}</h3>
            <p>Member since January 2025</p>
          </div>
        </div>
        <button 
          className="edit-profile hover-grow"
          onClick={() => setShowEditProfile(true)}
        >
          Edit Profile
        </button>
      </div>
      
      <div className="settings-tabs">
        <button 
          onClick={() => setActiveSettingsTab('privacy')}
          className={`tab-button ${activeSettingsTab === 'privacy' ? 'active' : ''}`}
        >
          Privacy
        </button>
        <button 
          onClick={() => setActiveSettingsTab('notifications')}
          className={`tab-button ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
        >
          Notifications
        </button>
        <button 
          onClick={() => setActiveSettingsTab('appearance')}
          className={`tab-button ${activeSettingsTab === 'appearance' ? 'active' : ''}`}
        >
          Appearance
        </button>
      </div>
      
      {activeSettingsTab === 'privacy' && (
        <div className="settings-content slide-right">
          <div className="setting-item">
            <div className="setting-info">
              <Shield size={20} />
              <div>
                <h4>Location Sharing</h4>
                <p>Control who can see your location</p>
              </div>
            </div>
            <select 
              value={locationSharing}
              onChange={(e) => setLocationSharing(e.target.value)}
              className="setting-select"
            >
              <option value="off">Off</option>
              <option value="limited">Only with trusted contacts</option>
              <option value="friends">Friends only</option>
              <option value="public">Public (not recommended)</option>
            </select>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <Users size={20} />
              <div>
                <h4>Trusted Contacts</h4>
                <p>Manage your emergency contacts</p>
              </div>
            </div>
            <button className="setting-button hover-grow">Manage</button>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <BookOpen size={20} />
              <div>
                <h4>Data & Privacy</h4>
                <p>How we use your data</p>
              </div>
            </div>
            <button className="setting-button hover-grow">View</button>
          </div>
        </div>
      )}
      
      {activeSettingsTab === 'notifications' && (
        <div className="settings-content slide-right">
          <div className="setting-item">
            <div className="setting-info">
              <Bell size={20} />
              <div>
                <h4>Notifications</h4>
                <p>Enable or disable all notifications</p>
              </div>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <AlertTriangle size={20} />
              <div>
                <h4>Safety Alerts</h4>
                <p>Receive alerts about nearby incidents</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <MessageCircle size={20} />
              <div>
                <h4>Community Updates</h4>
                <p>Get updates from your communities</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      )}
      
      {activeSettingsTab === 'appearance' && (
        <div className="settings-content slide-right">
          <div className="setting-item">
            <div className="setting-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <div>
                <h4>Dark Mode</h4>
                <p>Switch between light and dark theme</p>
              </div>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <div>
                <h4>Font Size</h4>
                <p>Adjust text size for better readability</p>
              </div>
            </div>
            <select className="setting-select">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="logout-container">
        <button className="logout-button hover-grow">Log Out</button>
      </div>
      
      {showEditProfile && (
        <div className="edit-profile-modal">
          <div className="modal-content slide-up">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="close-button hover-grow"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={saveProfile}
                className="save-button hover-grow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SOSModal({ onClose, trustedContacts }) {
  const [countdown, setCountdown] = useState(5);
  const [confirmed, setConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const countdownRef = useRef(null);
  
  const handleConfirm = async () => {
    setConfirmed(true);
    setIsSending(true);
    
    try {
      const location = await apiService.getUserLocation();
      const message = `EMERGENCY! I need help! My current location is approximately: ${location.address}. 
      Sent via EmpowerSafe App at ${new Date().toLocaleTimeString()}.`;
      
      const response = await apiService.sendEmergencySMS(
        trustedContacts,
        message,
        location
      );
      
      setSendStatus({
        success: response.success,
        message: response.message,
        responses: response.responses
      });
    } catch (error) {
      console.error('Failed to send alerts:', error);
      setSendStatus({
        success: false,
        message: 'Failed to send alerts. Please try again.',
        error: error.message
      });
    } finally {
      setIsSending(false);
    }
  };
  
  useEffect(() => {
    if (countdown > 0 && !confirmed) {
      countdownRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !confirmed) {
      handleConfirm();
    }
    
    return () => clearTimeout(countdownRef.current);
  }, [countdown, confirmed]);

  return (
    <div className="sos-modal-overlay">
      <div className="sos-modal pulse">
        <div className="sos-header">
          <AlertTriangle size={32} className="sos-alert-icon" />
          <h2>Emergency SOS Activated</h2>
        </div>
        
        {isSending ? (
          <div className="sos-loading">
            <Loader2 className="spinner" size={32} />
            <p>Sending alerts to {trustedContacts.length} contacts...</p>
          </div>
        ) : sendStatus ? (
          <div className={`sos-status ${sendStatus.success ? 'success' : 'error'}`}>
            <h3>{sendStatus.success ? 'Alerts Sent Successfully' : 'Alert Failed'}</h3>
            <p>{sendStatus.message}</p>
            
            {sendStatus.success && (
              <div className="contact-status-list">
                {trustedContacts.map((contact) => (
                  <div key={contact.id} className="contact-status-item">
                    <span>{contact.name}</span>
                    <span className="status-indicator success">
                      <Check size={16} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="sos-message">
              {confirmed ? (
                "Help is on the way! Your location has been shared with emergency contacts."
              ) : (
                `Sending alert to ${trustedContacts.length} contacts in ${countdown} seconds.`
              )}
            </p>
            
            <div className="sos-buttons">
              {!confirmed && (
                <>
                  <button 
                    onClick={handleConfirm}
                    className="confirm-sos hover-grow"
                    disabled={isSending}
                  >
                    Confirm Emergency
                  </button>
                  <button 
                    onClick={onClose}
                    className="cancel-sos hover-grow"
                    disabled={isSending}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            
            <div className="contacts-preview">
              <p>Alert will be sent to:</p>
              <div className="contact-chips">
                {trustedContacts.map(contact => (
                  <span key={contact.id} className="contact-chip">
                    {contact.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
        
        {!isSending && (
          <button 
            onClick={onClose}
            className="close-sos-button hover-grow"
          >
            {sendStatus ? 'Close' : 'Cancel Emergency'}
          </button>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, description, time }) {
  return (
    <div className="activity-item hover-scale">
      <div className="activity-icon">
        {icon}
      </div>
      <div className="activity-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  );
}

function SafetyAlert({ type, location, time, color, onClick }) {
  return (
    <div 
      className={`safety-alert ${color} hover-scale`}
      onClick={onClick}
    >
      <div>
        <span>{type}</span>
        <p>{location}</p>
      </div>
      <div className="alert-time">{time}</div>
    </div>
  );
}

export default App;