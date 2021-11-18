const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');
const {uploadCourseImg} = require('../utils/uploadImage'); 

//define route

router.post('/create/create-course', uploadCourseImg.single('img'), courseController.checkTypeCourse, courseController.create);
router.get('/create', courseController.showForm);


module.exports = router;