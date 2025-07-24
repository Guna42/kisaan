const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

// Permissive CORS (move to top, before any routes)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: false
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// JWT secret (fixed, from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Profile route
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Token verification endpoint
app.get('/api/verify-token', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

// Handle CORS preflight for predict
app.options('/api/predict', cors(), (req, res) => {
  console.log('Received OPTIONS request for /api/predict');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.status(200).send();
});

// Handle CORS preflight for water-recommendation
app.options('/api/water-recommendation', cors(), (req, res) => {
  console.log('Received OPTIONS request for /api/water-recommendation');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.status(200).send();
});

app.post('/api/predict', (req, res) => {
  console.log('Received POST /api/predict request:', JSON.stringify(req.body, null, 2));
  const { State_Name, District_Name, Crop_Year, Season, Crop, Area } = req.body;

  // Validate inputs
  if (State_Name === undefined || District_Name === undefined || Crop_Year === undefined || Season === undefined || Crop === undefined || Area === undefined) {
    console.log('Validation failed: Missing fields', { State_Name, District_Name, Crop_Year, Season, Crop, Area });
    return res.status(400).json({ error: 'All fields (State_Name, District_Name, Crop_Year, Season, Crop, Area) are required.' });
  }

  // Validate numeric fields
  const parsedCropYear = parseInt(Crop_Year);
  const parsedArea = parseFloat(Area);
  if (isNaN(parsedCropYear) || isNaN(parsedArea)) {
    console.log('Validation failed: Invalid numeric fields', { Crop_Year, Area });
    return res.status(400).json({ error: 'Crop_Year and Area must be valid numbers.' });
  }

  // Convert inputs to JSON
  const inputData = JSON.stringify({
    State_Name,
    District_Name,
    Crop_Year: parsedCropYear,
    Season,
    Crop,
    Area: parsedArea
  });

  console.log('Sending to Python script:', inputData);

  // Run Python script
  const pythonProcess = spawn('C:\\Users\\GUNA\\Videos\\agrisage\\agrisage\\backend\\crop_env\\Scripts\\python.exe', [
    path.join(__dirname, 'interactive_crop_predict.py'),
    inputData
  ]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error('Python stderr:', data.toString());
  });

  pythonProcess.on('error', (err) => {
    console.error('Python process error:', err.message);
    res.status(500).json({ error: 'Failed to spawn Python process.', details: err.message });
  });

  pythonProcess.on('close', (code) => {
    console.log('Python script exited with code:', code);
    console.log('Python output:', output);
    console.log('Python error (if any):', errorOutput);
    if (code === 0) {
      try {
        const result = JSON.parse(output.trim());
        if (result.error) {
          console.log('Python script returned error:', result.error);
          res.status(400).json({ error: result.error });
        } else {
          console.log('Prediction successful:', result.production);
          res.json({ production: result.production });
        }
      } catch (e) {
        console.error('JSON parse error:', e.message);
        res.status(500).json({ error: 'Invalid response from Python script.', details: output });
      }
    } else {
      console.error('Python script failed with code:', code);
      res.status(500).json({ error: 'Prediction failed.', details: errorOutput || 'No error details provided by Python script.' });
    }
  });
});

console.log("Registering /api/water-recommendation route...");
app.post('/api/water-recommendation', (req, res) => {
  console.log("Received POST /api/water-recommendation");
  console.log('Received POST /api/water-recommendation request:', JSON.stringify(req.body, null, 2));
  const { temperature, humidity, precipitation, crop_type, soil_type } = req.body;

  // Validate inputs
  if (temperature === undefined || humidity === undefined || precipitation === undefined || crop_type === undefined || soil_type === undefined) {
    console.log('Validation failed: Missing fields', { temperature, humidity, precipitation, crop_type, soil_type });
    return res.status(400).json({ error: 'All fields (temperature, humidity, precipitation, crop_type, soil_type) are required.' });
  }

  // Validate numeric fields
  const parsedTemperature = parseFloat(temperature);
  const parsedHumidity = parseFloat(humidity);
  const parsedPrecipitation = parseFloat(precipitation);
  if (isNaN(parsedTemperature) || isNaN(parsedHumidity) || isNaN(parsedPrecipitation)) {
    console.log('Validation failed: Invalid numeric fields', { temperature, humidity, precipitation });
    return res.status(400).json({ error: 'Temperature, humidity, and precipitation must be valid numbers.' });
  }

  // Convert inputs to JSON
  const inputData = JSON.stringify({
    temperature: parsedTemperature,
    humidity: parsedHumidity,
    precipitation: parsedPrecipitation,
    crop_type,
    soil_type
  });

  console.log('Sending to Python script:', inputData);

  // Run Python script
  const pythonProcess = spawn('C:\\Users\\GUNA\\Videos\\agrisage\\agrisage\\backend\\crop_env\\Scripts\\python.exe', [
    path.join(__dirname, 'water_recommendation_predict.py'),
    inputData
  ], { cwd: __dirname }); // Set working directory

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error('Python stderr:', data.toString());
  });

  pythonProcess.on('error', (err) => {
    console.error('Python process error:', err.message);
    res.status(500).json({ error: 'Failed to spawn Python process.', details: err.message });
  });

  pythonProcess.on('close', (code) => {
    console.log('Python script exited with code:', code);
    console.log('Python output:', output);
    console.log('Python error (if any):', errorOutput);
    if (code === 0) {
      try {
        const result = JSON.parse(output.trim());
        if (result.error) {
          console.log('Python script returned error:', result.error);
          res.status(400).json({ error: result.error });
        } else {
          console.log('Prediction successful:', result.recommendation);
          res.json({ recommendation: result.recommendation });
        }
      } catch (e) {
        console.error('JSON parse error:', e.message);
        res.status(500).json({ error: 'Invalid response from Python script.', details: output });
      }
    } else {
      console.error('Python script failed with code:', code);
      res.status(500).json({ error: 'Prediction failed.', details: errorOutput || 'No error details provided by Python script.' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port or close the other process.`);
  } else {
    console.error('Server error:', err.message);
  }
});