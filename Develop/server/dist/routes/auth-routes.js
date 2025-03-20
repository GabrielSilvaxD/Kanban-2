import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const router = Router();
// Login route
router.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find the user in the database
        const user = await User.findOne({
            where: { username }
        });
        // If user doesn't exist or password is incorrect
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Generate JWT token
        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: process.env.JWT_EXPIRATION || '1h'
        });
        // Return the token
        return res.json({ token });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
export default router;
