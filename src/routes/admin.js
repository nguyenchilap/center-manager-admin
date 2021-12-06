const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');

//define route
router.post('/create-account', adminController.createAccount);

router.get('/', adminController.index);



module.exports = router;