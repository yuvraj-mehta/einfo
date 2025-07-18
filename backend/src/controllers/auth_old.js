const prisma = require("../config/database");
const authService = require("../services/auth");
const googleAuthService = require("../services/googleAuth");
const emailService = require("../services/email");
const { v4: uuidv4 } = require("uuid");

class AuthController {
  /**
   * Register new user
   */
  async register(req, res, next) {
    try {
      const { email, username, name, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
          return res.status(409).json({
            success: false,
            message: "Email already registered",
          });
        }
        if (existingUser.username === username.toLowerCase()) {
          return res.status(409).json({
            success: false,
            message: "Username already taken",
          });
        }
      }

      // Hash password
      const passwordHash = await authService.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          name,
          passwordHash,
          profile: {
            create: {}, // Create empty profile
          },
        },
        include: {
          profile: true,
        },
      });

      // Create email verification token
      const verificationToken = authService.generateRandomToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: verificationToken,
          expiresAt,
        },
      });

      // Send verification email
      await emailService.sendEmailVerification(
        user.email,
        verificationToken,
        user.name
      );

      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            emailVerified: user.emailVerified,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Check password
      const isPasswordValid = await authService.comparePassword(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = authService.generateToken(user);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatarUrl,
            emailVerified: user.emailVerified,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Google OAuth login
   */
  async googleLogin(req, res, next) {
    try {
      const { google_token, username } = req.body;

      // Verify Google token
      const googleUser = await googleAuthService.verifyGoogleToken(google_token);

      // Check if user exists
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId: googleUser.googleId },
            { email: googleUser.email.toLowerCase() },
          ],
        },
        include: {
          profile: true,
        },
      });

      if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              googleId: googleUser.googleId,
              emailVerified: true,
              avatarUrl: googleUser.avatarUrl,
            },
            include: {
              profile: true,
            },
          });
        }
      } else {
        // Create new user
        let newUsername = username;
        if (!newUsername) {
          const baseUsername = googleAuthService.generateUsernameFromEmail(googleUser.email);
          newUsername = await googleAuthService.generateUniqueUsername(baseUsername, prisma);
        }

        // Check if provided username is available
        if (username) {
          const existingUser = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
          });

          if (existingUser) {
            return res.status(409).json({
              success: false,
              message: "Username already taken",
            });
          }
        }

        user = await prisma.user.create({
          data: {
            email: googleUser.email.toLowerCase(),
            username: newUsername.toLowerCase(),
            name: googleUser.name,
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl,
            emailVerified: true,
            profile: {
              create: {}, // Create empty profile
            },
          },
          include: {
            profile: true,
          },
        });

        // Send welcome email
        await emailService.sendWelcomeEmail(user.email, user.name);
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Generate token
      const token = authService.generateToken(user);

      res.json({
        success: true,
        message: "Google login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatarUrl,
            emailVerified: user.emailVerified,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can log this event for security monitoring
      console.log(`User ${req.user.id} logged out at ${new Date().toISOString()}`);

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify token
   */
  async verifyToken(req, res, next) {
    try {
      // User is already attached to req by auth middleware
      res.json({
        success: true,
        message: "Token is valid",
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            name: req.user.name,
            avatar: req.user.avatarUrl,
            emailVerified: req.user.emailVerified,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: "If the email exists, a reset link has been sent",
        });
      }

      // Delete existing reset tokens
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id },
      });

      // Create new reset token
      const resetToken = authService.generateRandomToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
        },
      });

      // Send reset email
      await emailService.sendPasswordReset(user.email, resetToken, user.name);

      res.json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, new_password } = req.body;

      // Find valid reset token
      const resetRecord = await prisma.passwordReset.findFirst({
        where: {
          token,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (!resetRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Hash new password
      const passwordHash = await authService.hashPassword(new_password);

      // Update password
      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      });

      // Mark token as used
      await prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { isUsed: true },
      });

      res.json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;

      // Find valid verification token
      const verificationRecord = await prisma.emailVerification.findFirst({
        where: {
          token,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (!verificationRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification token",
        });
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: verificationRecord.userId },
        data: { emailVerified: true },
      });

      // Mark token as used
      await prisma.emailVerification.update({
        where: { id: verificationRecord.id },
        data: { isUsed: true },
      });

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
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

      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      });

      res.json({
        success: true,
        available: !existingUser,
        message: existingUser ? "Username is already taken" : "Username is available",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
