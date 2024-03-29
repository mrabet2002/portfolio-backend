const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port 3000

app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable CORS for all routes

app.post('/send-mail', async (req, res) => {
    const { email, name, subject, message } = req.body;

    if (!email || !name || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        name: name,
        subject: subject,
        text: message // Change to 'html' for HTML emails
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the email server!');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
