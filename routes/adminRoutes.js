const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminPage);
router.post('/toggle', adminController.toggleSettings);
router.post('/delete-user', adminController.deleteUser);
router.post('/delete-log', adminController.deleteXssLog);


module.exports = router;
