const Course = require('../models/Course');
const Student = require('../models/Student');
const CourseType = require('../models/CourseType');
const courseRepo = require('../repository/CourseRepository');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');
const {uploadCourseImage} = require('../../config/firebase');

class CourseController {

    //[GET] /courses/
    showCourses(req, res, next){
        Promise.all([Course.find(), Course.countDocumentsDeleted()])
        .then(([courses, deletedCount]) => {
            res.render('courses/manage', {
                user: req.user,
                courses: multiMongooseToObject(courses),
                deletedCount
            });
        })
        .catch(next);   
    }

    //[GET] /courses/rubbish/
    showCourseDeleted(req, res, next){
        Course.findDeleted()
        .then(courses => {
            res.render('courses/rubbish', {
                courses: multiMongooseToObject(courses),
                user: req.user
            })
        })
        .catch(next);
    }

    //[GET] /courses/create
    showForm(req, res, next){
        CourseType.find({})
        .then(courseTypes => {
            res.render('courses/create', {
                courseTypes: multiMongooseToObject(courseTypes),
                user: req.user,
            });  
        })
        .catch(next);
    }

    //[POST] /courses/create/create-course
    checkTypeCourse(req, res, next){
        const formData = req.body;
        if (formData['type-new']){
            formData['type-new'].forEach((newType) => {
                const courseType = new CourseType({name: newType});
                courseType.save()
                .then(next())
                .catch(next);
            })
        }
        else next();
    }

    create(req, res, next){
        const formData = req.body;
        const fileData = req.file;
        const lessonList = [];
        if (formData.lessonNames){
            formData.lessonNames.forEach((lessonName, index) => {
                lessonList.push({
                    name: lessonName,
                    description: formData.lessonDescripts[index]
                });
            })
        }

        async function getUrlImg(){
            return await uploadCourseImage(`src/public/img/courses/${fileData.originalname}`, 
                        fileData.originalname);
        }

        if (!formData.type) formData.type = [];
        let course = new Course ({ name: formData.name, 
            description: formData.description, 
            price: formData.price,
            courseTypes: formData.type.concat(formData['type-new']),
            courseLessons: lessonList,
            level: formData.level,
            createBy: req.user._id,
        });

        getUrlImg()
        .then(url => {course.img = url; return course})
        .then((course) => course.save())
        .then(() => res.redirect('/courses/'))
        .catch(next);
    }

    // [GET] /courses/:id/edit
    showCourse(req, res, next){
        CourseType.find({})
        .then((types) => {
            Course.findOne({_id: req.params.id})
            .then((course) => {
                const courseStudents = course.courseStudents.map(element => element.studentId);
                Student.find({_id: {$in: courseStudents}})
                .then(students => {
                    let studentObjects = multiMongooseToObject(students);
                    studentObjects.forEach(studentObject => {
                        studentObject.registeredAt = course.courseStudents.find(element => element.studentId.toString() === studentObject._id.toString()).registerAt;
                    })
                    res.render('courses/edit', {
                        user: req.user,
                        course: mongooseToObject(course),
                        types: multiMongooseToObject(types),
                        students: studentObjects
                    });
                })
            })
            .catch(next);
        }) 
        .catch(next);
    }

    // [PUT] /courses/:id/
    edit(req, res, next){
        const course = courseRepo.editCourse(req.body);
        Course.updateOne({_id: req.params.id}, course)
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
    }

    // [PUT] /courses/:id/img
    editImage(req, res, next){
        const fileData = req.file;
        async function getUrlImg(){
            return await uploadCourseImage(`src/public/img/courses/${fileData.originalname}`, 
                        fileData.originalname);
        }
        getUrlImg()
        .then(url => Course.updateOne({_id: req.params.id}, {img: url}))
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
    }

    //[POST] /courses/handle-form-actions
    handleFormActions(req, res, next){
        switch(req.body["input-action"]){
            case 'Delete':
                Course.delete({ _id: { $in: req.body.itemIds } })
                .then(() => res.redirect('back'))
                .catch(next);
                break;
            default:
                res.json({message: 'Invalid Action'});
        }
    }

    //[POST] /courses/rubbish/handle-form-actions
    handleFormActionsRubbish(req, res, next){
        switch(req.body["input-action"]){
            case 'Restore':
                Course.restore({ _id: { $in: req.body.itemIds } })
                .then(() => res.redirect('back'))
                .catch(next);
                break;
            default:
                res.json({message: 'Invalid Action'});
        }
    }

    //[POST] /course/edit/:id/delete-comment/idComment
    deleteComment(req, res, next){
        Course.updateOne({_id: req.params.id}, {
            $pull: {
                courseComments: {
                    _id: req.params.idComment
                },
            },
        })
        .then(() => res.redirect('back'))
        .catch(next);
    }

    //[POST] /course/edit/:id/ban-comment/idStudent
    banComment(req, res, next){
        Student.updateOne({_id: req.params.idStudent}, {
            'banned.comment': true
        })
        .then(() => res.redirect('/students'))
        .catch(next);
    }

    //[POST] /course/edit/:id/ban-login/idStudent
    banLogin(req, res, next){
        Student.updateOne({_id: req.params.idStudent}, {
            'banned.login': true
        })
        .then(() => res.redirect('/students'))
        .catch(next);
    }

    //[GET] /course/chart
    showChart(req, res, next){
        res.render('courses/chart', {
            user: req.user
        });
    }

    //[GET] /course/chart/registered-students
    async showChartRegisteredStudents(req, res, next){
        if (req.query.month) {
            res.json(await courseRepo.findCourseByMonthAndYear(req.query.month, req.query.year));
        }
        else {
            res.json(await courseRepo.findCourseByYear(req.query.year));
        }
    }
}

module.exports = new CourseController();