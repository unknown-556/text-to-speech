const { convertTextToSpeech } = require('../utils/tts');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const convertController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Convert to speech
    const audioPath = await convertTextToSpeech(text);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(audioPath, {
      resource_type: 'video', // audio uploads as video in Cloudinary
      folder: 'tts-audio',
    });

    // Delete local file
    fs.unlinkSync(audioPath);

    res.json({ audioUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { convertController };
