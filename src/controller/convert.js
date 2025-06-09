const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cloudinary = require('../config/cloudinary');
const { convertTextToSpeech } = require('../utils/tts');

const convertController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(file.originalname).toLowerCase();
    let textContent = '';

    if (ext === '.pdf') {
      const dataBuffer = await fs.readFile(file.path);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else if (ext === '.docx') {
      const data = await mammoth.extractRawText({ path: file.path });
      textContent = data.value;
    } else {
      await fs.unlink(file.path);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!textContent.trim()) {
      await fs.unlink(file.path);
      return res.status(400).json({ error: 'No readable text in document' });
    }

    const audioPath = await convertTextToSpeech(textContent);

    const result = await cloudinary.uploader.upload(audioPath, {
      resource_type: 'video',
      folder: 'tts-audio',
    });

    await fs.unlink(file.path);
    await fs.unlink(audioPath);

    res.json({
      audioUrl: result.secure_url,
      text: textContent.trim(),
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { convertController };
