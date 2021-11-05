const express = require('express');
const router = express.Router();

const createController = require('../app/controllers/CreateController');

//define route
router.get('/courses', createController.createCourse);



module.exports = router;