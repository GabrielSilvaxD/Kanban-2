import { JwtPayload, jwtDecode } from 'jwt-decode';

// Extend JwtPayload to include our user fields
interface DecodedToken extends JwtPayload {
  username?: string;
  userId?: number;
}

class AuthService {
  getProfile() {
    // Decode the token to get user information
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  }

  loggedIn() {
    // Check if user is logged in by verifying token exists and is not expired
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    // Check if the token is expired by looking at the exp claim
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // exp is in seconds, Date.now() is in milliseconds
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token expiration check error:', err);
      return true; // If there's an error, consider the token expired
    }
  }

  getToken(): string {
    // Retrieve token from localStorage
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    // Save token to localStorage and redirect to home page
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Remove token from localStorage and redirect to login page
    localStorage.removeItem('id_token');
    window.location.assign('/login');
  }
}

export default new AuthService();
