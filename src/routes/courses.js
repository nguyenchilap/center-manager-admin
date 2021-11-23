const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');
const {uploadCourseImg, updateCourseImg} = require('../utils/uploadImage'); 

const multer = require('multer');
const upload = multer();

//define route

router.get('/edit/:id', courseController.showForm);

router.post('/create/create-course', uploadCourseImg.single('img'), courseController.checkTypeCourse, courseController.create);
router.get('/create', courseController.showForm);

router.post('/handle-form-actions', courseController.handleFormActions);

router.post('/rubbish/handle-form-actions', courseController.handleFormActionsRubbish);
router.get('/rubbish', courseController.showCourseDeleted);

router.put('/:id/image', updateCourseImg.single('img'), courseController.editImage);
router.get('/:id/edit', courseController.showCourse);
router.put('/:id',courseController.checkTypeCourse, courseController.edit);
router.get('/', courseController.showCourses);

module.exports = router;