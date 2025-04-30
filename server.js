require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Emergency SMS endpoint
app.post('/api/send-emergency-sms', async (req, res) => {
  const { contacts, message, userLocation } = req.body;
  
  // Validate inputs
  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No contacts provided'
    });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid message'
    });
  }

  try {
    const results = await Promise.all(
      contacts.map(async contact => {
        try {
          // Validate phone number format
          if (!contact.phone || typeof contact.phone !== 'string') {
            return {
              contactId: contact.id,
              status: 'failed',
              error: 'Invalid phone number'
            };
          }

          const result = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: contact.phone
          });
          
          return { 
            contactId: contact.id,
            status: 'sent',
            sid: result.sid,
            phone: contact.phone // For logging (remove in production)
          };
        } catch (error) {
          console.error(`Failed to send to ${contact.phone}:`, error);
          return { 
            contactId: contact.id,
            status: 'failed',
            error: error.message
          };
        }
      })
    );
    
    // Log the emergency alert (in production, store in database)
    console.log('Emergency alert sent:', {
      timestamp: new Date().toISOString(),
      location: userLocation,
      contacts: results,
      message: message
    });

    res.json({
      success: results.every(r => r.status === 'sent'),
      message: 'Messages processed',
      responses: results
    });
  } catch (error) {
    console.error('Failed to send messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send messages',
      error: error.message
    });
  }
});

// Trusted contacts endpoint
app.get('/api/trusted-contacts', async (req, res) => {
  try {
    // In production, get from database
    const contacts = [
      { id: 1, name: "Mom", phone: "+15551234567", status: "active" },
      { id: 2, name: "Lisa (Roommate)", phone: "+15559876543", status: "active" },
      { id: 3, name: "John (Friend)", phone: "+15555678901", status: "inactive" }
    ];
    
    res.json(contacts);
  } catch (error) {
    console.error('Failed to get contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});