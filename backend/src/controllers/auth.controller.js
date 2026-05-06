const usermodel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistmodel = require('../models/blacklist.model');

/**
 * @name registerUsercontroller
 * @description Controller to handle user registration
 * @access Public
 */
async function registerUsercontroller(req, res) {
    try {
        const { username, email, password } = req.body || {};

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const normalizedUsername = String(username).trim();
        const normalizedEmail = String(email).trim().toLowerCase();
        const userAlreadyExists = await usermodel.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] });

        if (userAlreadyExists) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new usermodel({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to register user." });
    }
}

/**
 * @name loginUsercontroller
 * @description Controller to handle user login
 * @access Public
 */
async function loginUsercontroller(req, res) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await usermodel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to login user." });
    }
}

/**
 * @name logoutUsercontroller
 * @description Controller to handle user logout (blacklist token)
 * @access Public
 */
async function logoutUsercontroller(req, res) {
    try {
        const token = req.cookies?.token;
        if (token) {
            await tokenBlacklistmodel.create({ token });
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to logout user." });
    }
}

/**
 * @name getMeController
 * @description Controller to get current logged in user details
 * @access Private
 */
async function getMeController(req, res) {
    try {
        const userId = req.userId;
        const user = await usermodel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: 'User details fetched successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to fetch user details." });
    }
}

module.exports = { registerUsercontroller, loginUsercontroller, logoutUsercontroller, getMeController };