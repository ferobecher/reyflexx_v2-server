const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.post('/api/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_SENDER_USER,
      pass: process.env.MAIL_SENDER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_SENDER_USER,
    to: process.env.MAIL_RECEIVER_USER,
    subject: 'Kontaktný formulár',
    text: `
      Meno: ${name}
      E-mail: ${email}
      Správa: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Form data submitted and email sent successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
