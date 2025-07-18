const prisma = require("../config/database");
// Removed legacy authService (password logic)
const googleAuthService = require("../services/googleAuth");
const emailService = require("../services/email");
const { v4: uuidv4 } = require("uuid");

class AuthController {
  /**
   * Google OAuth login/register
   */
  async googleLogin(req, res, next) {
    try {
      const { google_token, username } = req.body;

      if (!google_token) {
        return res.status(400).json({
          success: false,
          message: "Google token is required",
        });
      }

      // Verify Google token
      const googleUser = await googleAuthService.verifyGoogleToken(google_token);
      
      if (!googleUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid Google token",
        });
      }

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { googleId: googleUser.googleId },
        include: {
          profile: true,
        },
      });

      // If user doesn't exist, create new user
      if (!user) {
        // If no username provided for new user, generate one
        let finalUsername = username;
        if (!finalUsername) {
          finalUsername = await this.generateUsernameFromEmail(googleUser.email);
        }

        // Validate username (basic check)
        if (!finalUsername || typeof finalUsername !== 'string' || finalUsername.length < 3) {
          return res.status(400).json({
            success: false,
            message: 'Invalid username',
          });
        }

        // Check if username is taken
        const existingUser = await prisma.user.findUnique({
          where: { username: finalUsername.toLowerCase() },
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Username already taken",
          });
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            username: finalUsername.toLowerCase(),
            name: googleUser.name,
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl,
            emailVerified: googleUser.emailVerified,
            profile: {
              create: {
                // Initialize empty profile
              },
            },
          },
          include: {
            profile: true,
          },
        });

        console.log(`New user created: ${user.email}`);
      } else {
        // Update existing user data
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: googleUser.name,
            avatarUrl: googleUser.avatarUrl,
            emailVerified: googleUser.emailVerified,
          },
          include: {
            profile: true,
          },
        });
      }

      // Generate JWT token
      const token = authService.generateToken(user);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
            instantMessageSubject: user.instantMessageSubject,
            instantMessageBody: user.instantMessageBody,
          },
        },
      });
    } catch (error) {
      console.error("Google login error:", error);
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      // For JWT, we don't maintain server-side sessions
      // The client will remove the token
      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      next(error);
    }
  }

  /**
   * Verify token
   */
  async verifyToken(req, res, next) {
    try {
      const user = req.user; // Set by auth middleware

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
            instantMessageSubject: user.instantMessageSubject,
            instantMessageBody: user.instantMessageBody,
          },
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      next(error);
    }
  }

  /**
   * Check username availability
   */
  async checkUsername(req, res, next) {
    try {
      const { username } = req.params;

      // Validate username format
      const validation = authService.validateUsername(username);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.error,
        });
      }

      // Check if username exists
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      });

      res.json({
        success: true,
        data: {
          available: !existingUser,
        },
      });
    } catch (error) {
      console.error("Username check error:", error);
      next(error);
    }
  }

  /**
   * Generate username from email
   */
  async generateUsernameFromEmail(email) {
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    let username = baseUsername;
    let counter = 1;

    // Keep trying until we find an available username
    while (true) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (!existingUser) {
        return username;
      }

      username = `${baseUsername}${counter}`;
      counter++;

      // Prevent infinite loop
      if (counter > 1000) {
        throw new Error("Unable to generate unique username");
      }
    }
  }

  /**
   * Verify email (for future use)
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }

      // Find verification record
      const verification = await prisma.emailVerification.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!verification) {
        return res.status(404).json({
          success: false,
          message: "Invalid verification token",
        });
      }

      // Check if token is expired
      if (verification.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Verification token has expired",
        });
      }

      // Update user email verified status
      await prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true },
      });

      // Mark verification as used
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      });

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      next(error);
    }
  }
}

module.exports = new AuthController();
