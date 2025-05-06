const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const messages = require('../components/messages');
const db = require('../components/db'); // Import the correct database adapter
const lr = require('../components/log_request');
const config = require('../components/config');

// Register endpoint
router.post('/register', async (req, res) => {
    lr.log(req);
    
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({
            message: messages.invalidInput,
            error: 'Username, password, and email are required'
        });
    }

    try {
        // Check if user already exists
        db.adapter.getByLogin('users', username, (err, row) => {
            if (row) {
                return res.status(400).json({
                    message: messages.userExists,
                    error: 'Username already exists'
                });
            }

            // Hash password
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: messages.serverError,
                        error: 'Error hashing password'
                    });
                }

                // Create user
                const userData = {
                    login: username, // Use 'login' to match your users table schema
                    password: hash,
                    email
                };

                db.adapter.create('users', userData, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: messages.dbError,
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: messages.userCreated,
                        userId: result.id
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: messages.serverError,
            error: error.message
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    lr.log(req);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            message: messages.invalidInput,
            error: 'Username and password are required'
        });
    }

    try {
        // Find user
        db.adapter.getByLogin('users', username, (err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    message: messages.invalidCredentials,
                    error: 'Invalid username or password'
                });
            }

            // Verify password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({
                        message: messages.invalidCredentials,
                        error: 'Invalid username or password'
                    });
                }

                // Generate JWT
                const token = jwt.sign(
                    { userId: user.id, username: user.login }, // Use 'login' to match schema
                    config.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Store session
                const sessionData = {
                    user_id: user.id,
                    token,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                };

                db.adapter.create('session', sessionData, (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: messages.dbError,
                            error: err.message
                        });
                    }

                    res.status(200).json({
                        message: messages.loginSuccess,
                        token,
                        user: {
                            id: user.id,
                            username: user.login, // Use 'login' to match schema
                            email: user.email
                        }
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({
            message: messages.serverError,
            error: error.message
        });
    }
});

// Basic GET endpoint
router.get('/', (req, res) => {
    lr.log(req);    
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        message: messages.auth,
        status: db.adapter ? messages.dbConnectionSuccess : messages.dbConnectionError
    });
});

module.exports = router;