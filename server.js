require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRouter = require('./routes/contact');

// Initialize Express Engine Instance once
const app = express();
const PORT = process.env.PORT || 8080;

// ==========================================
// MIDDLEWARE CONFIGURATION MATRICES
// ==========================================

// Enable CORS securely for your local development environment
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://marvel-labtech.github.io"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Global parser interceptors for payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CORE ROUTING STRUCTURES
// ==========================================

// Mount project initialization contact pipelines
app.use('/api/v1', contactRouter);

// Base sanity check node endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: "ONLINE", system: "Marvel Tech Lab Cluster Engine" });
});

// ==========================================
// MONGO_DB INFRASTRUCTURE CONNECTION
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marvel_tech_lab';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('⚡ [CLUSTER SUCCESS] Connected to marvel_tech_lab database infrastructure.');
        
        // Start listening to runtime execution threads only after database maps correctly
        app.listen(PORT, () => {
            console.log(`🚀 [SERVER ONLINE] System Core active on channel: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ [DATABASE REFUSED] Cluster handshake failed:', error.message);
        process.exit(1);
    });

    // Add or verify this base sanity check endpoint in your server.js
app.get('/api/v1/health', (req, res) => {
    const dbState = mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED";
    res.status(200).json({ 
        status: "ONLINE", 
        database: dbState,
        system: "Marvel Tech Lab Cluster Engine" 
    });
});