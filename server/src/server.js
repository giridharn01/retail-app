const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Use compression
app.use(compression());

// ... existing code ... 