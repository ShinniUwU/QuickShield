import { SMTPServer } from 'smtp-server'; // For testing SMTP server
import { simpleParser } from 'mailparser'; // For parsing emails
import nodemailer from 'nodemailer'; // For sending emails
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// Function to send an email
export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string, // Use type assertion to ensure it's a string
    port: Number(process.env.SMTP_PORT), // Convert port to number
    secure: true, // Use true for port 465
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
    tls: {
      rejectUnauthorized: false, // change this if necessary
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Example" <example@gmail.com>', // change this
      to,
      subject,
      text,
    });

    console.log('Email sent:', info.messageId + " to " + to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Start the SMTP server for testing
const server = new SMTPServer({
  onData(stream, session, callback) {
    let emailData = '';

    stream.on('data', (chunk) => {
      emailData += chunk.toString();
    });

    stream.on('end', () => {
      simpleParser(emailData)
        .then((mail) => {
          console.log('Email received:', mail.subject);
          callback();
        })
        .catch((err) => callback(err));
    });
  },
  onAuth(auth, session, callback) {
    const { username, password } = auth;
    // Simple authentication check (for testing purposes)
    if (username === 'user' && password === 'pass') {
      callback(null, { user: 'user' });
    } else {
      callback(new Error('Invalid credentials'));
    }
  },
});

// Start the SMTP server
server.listen(587, () => {
  console.log('SMTP Server running on port 587');
});
