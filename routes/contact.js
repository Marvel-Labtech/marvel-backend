const express = require('express');
const router = express.Router();
const https = require('https');
const Project = require('../models/Project');

// =========================================================================
// EXPANDED LIVE NOTIFICATION WEBHOOK BROADCAST MODULE (DISCORD INTEGRATION)
// =========================================================================
const broadcastToDiscord = (companyName, email, phone, specialty, message, token) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    // Safety check: Exit silently if webhook is unconfigured
    if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("PASTE_YOUR_COPIED")) {
        console.warn('⚠️ [INTEGRATION WARN] Discord webhook URL is not configured.');
        return;
    }

    try {
        const urlParts = new URL(webhookUrl);
        const payloadData = JSON.stringify({
            username: "MTL Database Bot",
            embeds: [{
                title: "🗄️ NEW DATA OBJECT RECORDED IN CLUSTER",
                color: 10184447, // MTL Accent Purple hex mapping
                fields: [
                    { name: "🏢 Corporate Identity", value: `\`${companyName || 'N/A'}\``, inline: true },
                    { name: "📬 Connection Node", value: `\`${email || 'N/A'}\``, inline: true },
                    { name: "📞 Secure Phone Line", value: `\`${phone || 'N/A'}\``, inline: true },
                    { name: "⚡ Requested Specialty", value: `\`${specialty || 'N/A'}\``, inline: true },
                    { name: "🎟 Identification Token", value: `\`${token || 'N/A'}\``, inline: false },
                    { name: "📜 Data Set Payload", value: `\`\`\`text\n${message || 'No message provided.'}\n\`\`\``, inline: false }
                ],
                footer: { text: "Marvel Tech Lab - Cluster Automation Engine" },
                timestamp: new Date().toISOString()
            }]
        });

        const options = {
            hostname: urlParts.hostname,
            path: urlParts.pathname + urlParts.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payloadData)
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode >= 400) {
                console.error(`❌ Discord API returned error code: ${res.statusCode}`);
            }
        });

        req.on('error', (err) => {
            console.error('❌ Discord webhook request failure:', err.message);
        });

        req.write(payloadData);
        req.end();
    } catch (err) {
        console.error('❌ Failed to construct Discord webhook delivery:', err.message);
    }
};

// =========================================================================
// POST METHOD ROUTE: /api/v1/initialize-project
// =========================================================================
router.post('/initialize-project', async (req, res) => {
    try {
        const { companyName, email, phone, specialty, message } = req.body;

        // Structured Input Verification
        if (!companyName || !email || !phone || !specialty || !message) {
            return res.status(400).json({ 
                success: false, 
                error: "Validation Fault: Incomplete parameter mapping." 
            });
        }

        // Generate robust transaction token
        const transactionToken = `MTL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // 1. Commit straight into your custom MongoDB Cloud Collection
        const newProject = await Project.create({
            companyName,
            email,
            phone,
            specialty,
            message,
            transactionToken
        });

        // 2. Clear real-time log streaming inside your runtime terminal window
        console.log(`
📬 [NEW SYSTEM TRANSACTION SECURED]
ID:        ${newProject._id}
Company:   ${companyName}
Email:     ${email}
Phone:     ${phone}
Specialty: ${specialty}
Token:     ${transactionToken}
----------------------------------------------------------------`);

        // 3. Fire expanded visual notification block out to Discord channels
        broadcastToDiscord(companyName, email, phone, specialty, message, transactionToken);

        // Success Handshake Response
        return res.status(201).json({
            success: true,
            message: "Pipeline initialized. Data records committed to marvel_tech_lab cluster.",
            transactionToken: transactionToken
        });

    } catch (error) {
        console.error("❌ Database Operation Failure:", error.message);
        
        // Always reply with clean JSON instead of throwing HTML/plain-text 500 crashes
        return res.status(500).json({ 
            success: false, 
            error: "Internal System Data Write Error: " + error.message 
        });
    }
});

module.exports = router;