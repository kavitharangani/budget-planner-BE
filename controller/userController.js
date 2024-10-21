const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    // Destructure the first name, last name, email, and password from the request body
    const { userName, email, password } = req.body;
    
    try {
        // Check if a user with the given email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If the user exists, return a 400 Bad Request response with a message
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the user's password with bcrypt using 10 salt rounds for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the provided details
        const newUser = new User({
            userName,
            email,
            password: hashedPassword // Store the hashed password instead of the plain text
        });

        // Save the new user to the database
        await newUser.save();

        // Return a 201 Created response with a success message and the new user's details
        res.status(201).json({ message: 'User registered successfully', user: newUser });
        
    } catch (err) {
        // If there's an error during the process, return a 500 Internal Server Error response
        res.status(500).json({ message: 'Failed to register user', error: err.message });
    }
};


// Login function to authenticate a user
exports.login = async (req, res) => {
    // Destructure the email and password from the request body
    const { email, password } = req.body;
    
    try {
        // Check if the user exists in the database by email
        const user = await User.findOne({ email });
        if (!user) {
            // If user is not found, return a 401 Unauthorized response
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // If the password does not match, return a 401 Unauthorized response
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JSON Web Token (JWT) for the authenticated user
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '5      h' });
        
        // Return a 200 OK response with a success message and the generated token
        res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        // If an error occurs during the login process, return a 500 Internal Server Error response
        res.status(500).json({ message: 'Failed to login', error: err.message });
    }
};