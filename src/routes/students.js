const express = require('express');
const router = express.Router();

const studentController = require('../app/controllers/StudentController');

//define route
router.post('/banned/handle-form-actions', studentController.handleFormActionsBanned);
router.post('/handle-form-actions', studentController.handleFormActions);

router.get('/banned', studentController.showBanned);
router.get('/', studentController.showStudents);


module.exports = router;