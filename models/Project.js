const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }, // New property container
    specialty: { type: String, required: true, trim: true }, // New property container
    message: { type: String, required: true, trim: true },
    transactionToken: { type: String, unique: true, required: true },
    status: { type: String, enum: ['Discovery', 'Architecture Phase', 'Development', 'Deployed'], default: 'Discovery' }
}, {
    timestamps: true,
    collection: 'messages' // Anchors straight to marvel_tech_lab.messages
});

module.exports = mongoose.model('Project', ProjectSchema);