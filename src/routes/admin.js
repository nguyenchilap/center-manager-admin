const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');

//define route
router.post('/check-username', adminController.checkUsername);
router.post('/create-account', adminController.createAccount);

router.get('/', adminController.index);



module.exports = router;