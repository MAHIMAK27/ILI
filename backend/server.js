const config = require('./src/config/env'); // Validates env vars on load
const connectDB = require('./src/config/db');
const express = require('express');
const cors = require('cors');

// Middlewares
const requestLogger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');

// Routes
const apiRoutes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Centralized error handling
app.use(errorHandler);

// Connect Database
connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
