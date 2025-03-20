import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Then update req.user to req.authUser in your middleware
export const authenticateToken = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    // Extract the token (Bearer token format)
    const token = authHeader && authHeader.split(' ')[1];
    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // Attach the user data to the request for use in route handlers
        req.user = decoded;
        // Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        // If token verification fails, return 401 Unauthorized
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
