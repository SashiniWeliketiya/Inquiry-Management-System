const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

const authController = require('./src/controllers/authController');
const inquiryController = require('./src/controllers/inquiryController');
const authMiddleware = require('./src/middleware/auth');

// Auth Route
app.post('/api/auth/login', authController.login);

// Inquiry Routes
app.get('/api/inquiries', authMiddleware, inquiryController.getInquiries);
app.post('/api/inquiries', authMiddleware, inquiryController.createInquiry);
app.patch('/api/inquiries/:id/status', authMiddleware, inquiryController.updateStatus);


app.delete('/api/inquiries/:id', authMiddleware, inquiryController.deleteInquiry);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));