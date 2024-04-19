const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/youtubedatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    isOTPVerified: { type: Boolean, default: false } // Add a field to track OTP verification status
  });

const User = mongoose.model('User', userSchema);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shantoby1701@gmail.com', // <-- Replace with your Gmail address
    pass: 'hnhh mdux dpyz edfz'   // <-- Replace with your Gmail password
  }
});

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    videoFilePath: { type: String, required: true },
    uploader: { type: String, required: true } // Store the uploader's username
  });

const Video = mongoose.model('Video', videoSchema);

  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = './uploads/videos';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  
  const upload = multer({ storage: storage });
  
// Route for sending OTP
app.post('/api/sendotp', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Update user document with OTP
    user.otp = otp;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: 'shantoby1701@gmail.com', // <-- Replace with your Gmail address
      to: email,
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for user registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.js (or your server file)

// Route for verifying OTP
app.post('/api/verifyotp', async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP matches
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update user's OTP verification status
      user.isOTPVerified = true;
      // Reset OTP after successful verification
      user.otp = '';
      await user.save();
  
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


  
  
  // Route for updating password
  app.post('/api/changepassword', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
 
  app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      const videoFilePath = req.file.path;
  
      const newVideo = new Video({
        title,
        description,
        tags: tags.split(','),
        videoFilePath,
        uploader: 'anonymous', // Set uploader as 'anonymous' for now
      });
  
      await newVideo.save();
  
      res.status(200).json({ message: 'Video uploaded successfully' });
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
  app.get('/api/videos', async (req, res) => {
    try {
      const videos = await Video.find();
      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

 // Route for fetching videos uploaded by a specific user
app.get('/api/videos/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const videos = await Video.find({ uploader: userId }).populate('uploader');
      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching user videos:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Route for fetching videos for feed page (can be customized based on your logic)
app.get('/api/feed/videos', async (req, res) => {
    try {
      const videos = await Video.find().limit(10); // Example: Fetch latest 10 videos for the feed
      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching feed videos:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Login successful
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
