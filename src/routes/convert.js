const express = require('express');
const router = express.Router();
const { convertController } = require('../controller/convert');

router.post('/', convertController);

module.exports = router;
