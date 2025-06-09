const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

const convertTextToSpeech = async (text, filename = 'output', lang = 'en') => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, '../temp');
    const filePath = path.join(tempDir, `${filename}.mp3`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const gtts = new gTTS(text, lang);
    gtts.save(filePath, (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
};

module.exports = { convertTextToSpeech };
