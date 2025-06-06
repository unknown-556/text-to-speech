require('dotenv').config();
const express = require('express');
const app = express();
const convertRoutes = require('./src/routes/convert');
const path = require('path');
const fs = require('fs');

// Create temp folder if not exists
const tempDir = path.join(__dirname, 'src/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.use(express.json());
app.use('/api/convert', convertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
