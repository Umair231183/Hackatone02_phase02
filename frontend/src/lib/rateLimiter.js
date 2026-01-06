// src/lib/rateLimiter.js

// Simple client-side rate limiting for demonstration purposes
// In a real application, this should be implemented on the server side

class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 15 minutes window
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map(); // Store attempts by IP or identifier
  }

  isBlocked(identifier) {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts outside the window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    // Check if too many attempts
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return false;
  }

  getRemainingAttempts(identifier) {
    const attempts = this.attempts.get(identifier) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }

  reset(identifier) {
    this.attempts.delete(identifier);
  }
}

// Create a global rate limiter instance
const rateLimiter = new RateLimiter();

// Function to validate login attempts
export const validateLoginAttempt = (identifier) => {
  if (rateLimiter.isBlocked(identifier)) {
    const remainingTime = Math.ceil(rateLimiter.windowMs / 60000); // Minutes
    throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
  }
  
  const remainingAttempts = rateLimiter.getRemainingAttempts(identifier);
  return { success: true, remainingAttempts };
};

// Function to record a failed login attempt
export const recordFailedAttempt = (identifier) => {
  // The rate limiter automatically tracks attempts when checking
  // This function is just for clarity and future enhancements
  rateLimiter.isBlocked(identifier); // This adds the attempt to the list
};

// Function to validate registration attempts
export const validateRegistrationAttempt = (identifier) => {
  // Use a separate rate limiter for registration to prevent abuse
  const regLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour for registration
  
  if (regLimiter.isBlocked(identifier)) {
    const remainingTime = Math.ceil(regLimiter.windowMs / 3600000); // Hours
    throw new Error(`Too many registration attempts. Please try again in ${remainingTime} hours.`);
  }
  
  const remainingAttempts = regLimiter.getRemainingAttempts(identifier);
  return { success: true, remainingAttempts };
};

// Function to validate password reset attempts
export const validatePasswordResetAttempt = (identifier) => {
  const resetLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 attempts per 15 minutes for password reset
  
  if (resetLimiter.isBlocked(identifier)) {
    const remainingTime = Math.ceil(resetLimiter.windowMs / 60000); // Minutes
    throw new Error(`Too many password reset attempts. Please try again in ${remainingTime} minutes.`);
  }
  
  const remainingAttempts = resetLimiter.getRemainingAttempts(identifier);
  return { success: true, remainingAttempts };
};

// Export the rate limiter for direct use if needed
export default rateLimiter;