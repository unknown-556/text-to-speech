const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

const convertTextToSpeech = async (text, filename = 'output') => {
  return new Promise((resolve, reject) => {
    const gtts = new gTTS(text);
    const filePath = path.join(__dirname, `../temp/${filename}.mp3`);
    
    gtts.save(filePath, (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
};

module.exports = { convertTextToSpeech };
