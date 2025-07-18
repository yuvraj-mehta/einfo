const { OAuth2Client } = require("google-auth-library");

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Verify Google OAuth token
   */
  async verifyGoogleToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      throw new Error("Invalid Google token");
    }
  }

  /**
   * Generate username from email
   */
  generateUsernameFromEmail(email) {
    // Extract username part from email
    const emailPrefix = email.split("@")[0];
    
    // Clean up the username
    let username = emailPrefix
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric characters
      .substring(0, 12); // Limit to 12 characters to leave room for timestamp
    
    // Ensure minimum length
    if (username.length < 3) {
      username = username.padEnd(3, "0");
    }
    
    // Add timestamp and random number for uniqueness
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${username}${timestamp}${randomNum}`.substring(0, 20);
  }

  /**
   * Generate unique username
   */
  async generateUniqueUsername(baseUsername, prisma) {
    // If baseUsername already has timestamp/random suffix, try it first
    let username = baseUsername;
    
    // Check if the generated username is available
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existingUser) {
      return username;
    }
    
    // If still not unique, try a few more times with different random numbers
    for (let i = 0; i < 5; i++) {
      const timestamp = Date.now().toString().slice(-6);
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      // Extract just the base part (without previous timestamp/random)
      const basePart = baseUsername.replace(/\d+$/, '').substring(0, 12);
      username = `${basePart}${timestamp}${randomNum}`.substring(0, 20);
      
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!existingUser) {
        return username;
      }
    }
    
    // Fallback to original counter method if all else fails
    let counter = 1;
    const originalBase = baseUsername.replace(/\d+$/, '').substring(0, 15);
    
    while (true) {
      username = `${originalBase}${counter}`;
      
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!existingUser) {
        return username;
      }
      
      counter++;
    }
  }
}

module.exports = new GoogleAuthService();
