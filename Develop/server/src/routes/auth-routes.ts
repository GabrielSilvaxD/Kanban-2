import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/index.js'; // Adjust path as needed
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET is missing' });
    }

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Define payload
    const payload = { userId: user.id, username: user.username };

    // Define options with explicit type
    const options: SignOptions = {
      expiresIn: parseInt(process.env.JWT_SECRET) || '1h',
    };

    // Generate token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string, // Cast to string to satisfy TypeScript
      options
    );

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;