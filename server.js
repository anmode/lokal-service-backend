const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const tagRoutes = require('./routes/tagRoutes');

dotenv.config();

connectDB();

const app = express();
app.set('trust proxy', 1);


// Middleware
app.use(express.json());
app.use(cors());

// Initialize Passport (configuration is in config/passport.js)
require('./config/passport');

// Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', tagRoutes);

app.get('/', (req, res) => {
  res.send('Lokal Service API is running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
