const express = require('express');
const router = express.Router();

// Mock Database Layer
const capabilitiesData = [
    { id: 1, name: "UI/UX Design", framework: "Figma / Adobe XD" },
    { id: 2, name: "Full Stack Development", framework: "HTML/CSS/JS/Node.js" },
    { id: 3, name: "Software Engineering", framework: "System Logic" },
    { id: 4, name: "PHP / Laravel Systems", framework: "MVC / Eloquent" },
    { id: 5, name: "Mobile App Development", framework: "iOS & Android" },
    { id: 6, name: "Data Analytics & Insights", framework: "Big Data" },
    { id: 7, name: "Cybersecurity Matrix", framework: "Threat Mitigation" },
    { id: 8, name: "Graphic Design & Brand Asset", framework: "Visual Assets" }
];

const artifactsData = [
    {
        id: "repo-01",
        name: "Nexa Commerce Suite",
        category: "E-Commerce Architecture",
        latency: "12ms",
        targetCapacity: "High Concurrency Nodes"
    },
    {
        id: "repo-02",
        name: "Neural Attendance Matrix",
        category: "Biometrics & Verification",
        latency: "40ms",
        targetCapacity: "500+ Concurrent Nodes"
    }
];

// GET: /api/v1/capabilities
router.get('/capabilities', (req, res) => {
    res.status(200).json({ success: true, count: capabilitiesData.length, data: capabilitiesData });
});

// GET: /api/v1/artifacts
router.get('/artifacts', (req, res) => {
    res.status(200).json({ success: true, data: artifactsData });
});
const Project = require('../models/Project'); // Import the schema model

// GET: /api/v1/admin/messages
router.get('/admin/messages', async (req, res) => {
    try {
        // Fetch all project messages from MongoDB, sorting the newest submissions to the top
        const allMessages = await Project.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: allMessages.length,
            vault: allMessages
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Could not retrieve message vault parameters." });
    }
});

module.exports = router;