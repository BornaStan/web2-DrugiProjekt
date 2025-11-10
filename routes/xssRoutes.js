const express = require('express');
const router = express.Router();
const xssController = require('../controllers/xssController');

router.get('/messages', xssController.showMessages);
router.get('/messages/new', xssController.newMessageForm);
router.post('/messages', xssController.saveMessage);
router.post('/messages/delete', xssController.deleteMessage);
router.get('/log', xssController.logData);

module.exports = router;
