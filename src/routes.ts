// routes.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail } from './smtp'; // Import the sendEmail function

const prisma = new PrismaClient();

interface User {
  username: string;
  email: string;
  password: string;
}

export function registerRoutes(server: FastifyInstance) {
  // User Registration Route
  server.post<{ Body: User }>('/register', async (request, reply) => {
    const { username, email, password } = request.body;

    // Check if username or email already exists
    const userExists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (userExists) {
      return reply.status(400).send({ message: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    reply.send({ message: 'User registered successfully' });
  });

  // User Login Route
  server.post<{ Body: { email: string; password: string } }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(400).send({ message: 'Invalid email' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return reply.status(400).send({ message: 'Invalid password' });
    }

    reply.send({ message: 'User logged in successfully' });
  });

  // Forgot Password Route
  server.post<{ Body: { email: string } }>('/forgot-password', async (request, reply) => {
    const { email } = request.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.send({ message: 'If this email is registered, a password reset link will be sent to it.' });
    }

    // Generate and hash token
    const token = generateSecureRandomToken();
    const hashedToken = await bcrypt.hash(token, 10);

    // Set token expiry
    const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the token in the database
    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.id,
        token: hashedToken,
        token_expiry: tokenExpiry,
      },
    });

    // Send email with reset link
    sendPasswordResetEmail(email, token);
    reply.send({ message: 'Password reset link sent.' });
  });
}

// Generate a secure random token
function generateSecureRandomToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Send password reset email
function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `https://example.com/reset-password/${token}`; // change this based on your website's URL
  const subject = 'Password Reset Request';
  const text = `Please click the following link to reset your password: ${resetLink}`;
  
  sendEmail(email, subject, text).catch(console.error);
}
