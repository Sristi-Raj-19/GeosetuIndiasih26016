const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure database config is loaded
require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS and JSON parsing
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Determine frontend directory
let frontendDir = path.resolve(__dirname, '../frontend');
if (!fs.existsSync(frontendDir)) {
  frontendDir = path.resolve(__dirname, '../../frontend');
}

// Request logging (clean format)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parcels', require('./routes/parcels'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/agreements', require('./routes/agreements'));
app.use('/api/compensation', require('./routes/compensation'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/config', require('./routes/config'));

// Serve static frontend files
app.use(express.static(frontendDir));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(frontendDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend index.html not found.');
  }
});

// Global Error Handler to guarantee the server never crashes
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Start Express Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================================');
  console.log(' 🇮🇳 GeoSetu-India (भूसेतु-भारत) Web Platform is Live!');
  console.log(` 🚀 Node.js + Express Server running on: http://localhost:${PORT}`);
  console.log(` 📁 Serving Web Frontend from: ${frontendDir}`);
  console.log(` ⚡ Supabase Database: ${process.env.SUPABASE_URL ? 'Connected' : 'Ready (Standalone Mode)'}`);
  console.log('==========================================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server gracefully...');
  server.close(() => console.log('HTTP server closed.'));
});

module.exports = app;
