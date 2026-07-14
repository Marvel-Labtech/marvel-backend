const express = require('express');
const router = express.Router();
const https = require('https');
const Project = require('../models/Project');

// Expanded live notification webhook broadcast module
const broadcastToDiscord = (companyName, email, phone, specialty, message, token) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.trim() === "" || webhookUrl.includes("PASTE_YOUR_COPIED")) return;

    try {
        const urlParts = new URL(webhookUrl);
        const payloadData = JSON.stringify({
            username: "MTL Database Bot",
            embeds: [{
                title: "🗄️ NEW DATA OBJECT RECORDED IN CLUSTER",
                color: 10184447,
                fields: [
                    { name: "🏢 Corporate Identity", value: `\`${companyName}\``, inline: true },
                    { name: "📬 Connection Node", value: `\`${email}\``, inline: true },
                    { name: "📞 Secure Phone Line", value: `\`${phone}\``, inline: true },
                    { name: "⚡ Requested Specialty", value: `\`${specialty}\``, inline: true },
                    { name: "🎟 Identification Token", value: `\`${token}\``, inline: false },
                    { name: "📜 Data Set Payload", value: `\`\`\`text\n${message}\n\`\`\``, inline: false }
                ],
                footer: { text: "Marvel Tech Lab - Cluster Automation Engine" },
                timestamp: new Date()
            }]
        });

        const options = {
            hostname: urlParts.hostname,
            path: urlParts.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payloadData)
            }
        };

        const req = https.request(options);
        req.write(payloadData);
        req.end();
    } catch (err) {
        console.error('❌ Discord webhook failure:', err.message);
    }
};

// POST: /api/v1/initialize-project
router.post('/initialize-project', async (req, res) => {
    try {
        const { companyName, email, phone, specialty, message } = req.body;

        // Structured Input Verification
        if (!companyName || !email || !phone || !specialty || !message) {
            return res.status(400).json({ success: false, error: "Validation Fault: Incomplete parameter mapping." });
        }

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

        // 2. Clear real-time log streaming inside your MacBook terminal window
        console.log(`
📬 [NEW SYSTEM TRANSACTION SECURED]
ID:        ${newProject._id}
Company:   ${companyName}
Email:     ${email}
Phone:     ${phone}
Specialty: ${specialty}
Message:   ${message}
----------------------------------------------------------------`);

        // 3. Fire expanded visual notification block out to Discord channels
        broadcastToDiscord(companyName, email, phone, specialty, message, transactionToken);

        res.status(201).json({
            success: true,
            message: "Pipeline initialized. Data records committed to marvel_tech_lab cluster.",
            transactionToken: transactionToken
        });

    } catch (error) {
        console.error("❌ Database Operation Failure:", error.message);
        res.status(500).json({ success: false, error: "Internal System Data Write Error." });
    }
});

module.exports = router;