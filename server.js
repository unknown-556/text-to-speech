require('dotenv').config();
const express = require('express');
const app = express();
const convertRoutes = require('./src/routes/convert');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Create temp folder if not exists
const tempDir = path.join(__dirname, 'src/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cors({ origin: '*' }));

// Health check route
app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/convert', convertRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size too large. Max limit is 5MB.' });
  }
  if (err.message === 'Only PDF and DOCX files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
