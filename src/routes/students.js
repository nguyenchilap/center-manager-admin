const express = require('express');
const router = express.Router();

const studentController = require('../app/controllers/StudentController');

//define route
router.get('/', studentController.showStudents);

module.exports = router;