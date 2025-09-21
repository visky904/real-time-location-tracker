// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const cors = require('cors');

const allowedOrigins = ['https://real-time-location-tracker-zs1l.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

const twilio = require('twilio');

// Initialize the Express app
const app = express();

// Middleware to allow cross-origin requests from your React app
app.use(cors(corsOptions));
// Middleware to parse incoming JSON bodies
app.use(express.json());

// --- Twilio Setup ---
// Get credentials from the .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Create an authenticated Twilio client
const client = twilio(accountSid, authToken);


// --- API Endpoints ---

// Health check endpoint to make sure the server is running
app.get('/', (req, res) => {
    res.send('Jharkhand Tourism Backend is running!');
});

/**
 * SOS Alert Endpoint
 * Receives a POST request with the user's location and sends an SMS alert.
 */
app.post('/api/sos/trigger', async (req, res) => {
    // Get location and user data from the request body
    const { latitude, longitude, userId, message } = req.body;

    // Basic validation
    if (!latitude || !longitude || !userId) {
        return res.status(400).json({ success: false, error: 'Missing required data: latitude, longitude, and userId.' });
    }

    // Create a Google Maps link for the location
    const googleMapsLink = `http://maps.google.com/maps?q=${latitude},${longitude}`;
    const alertMessage = `URGENT SOS! User '${userId}' needs help. Last known location: ${googleMapsLink}. Custom message: "${message || 'No message provided.'}"`;

    try {
        // Use the Twilio client to send an SMS
        await client.messages.create({
            body: alertMessage,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: process.env.EMERGENCY_PHONE_NUMBER  // The phone number to notify
        });

        console.log('SOS Alert SMS Sent Successfully!');
        res.status(200).json({ success: true, message: 'SOS alert sent successfully.' });

    } catch (error) {
        // If there's an error (e.g., with Twilio credentials), log it and send an error response
        console.error('Failed to send SOS alert SMS:', error);
        res.status(500).json({ success: false, error: 'Failed to send SOS alert.' });
    }
});


// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});