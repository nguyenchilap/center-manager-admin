const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
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
        // res.json(formData);
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
                res.render('courses/edit', {
                    user: req.user,
                    course: mongooseToObject(course),
                    types: multiMongooseToObject(types)
                });
            })
            .catch(next);
        }) 
        .catch(next);
    }

    // [PUT] /courses/:id/
    edit(req, res, next){
        const formData = req.body;
        const lessonList = [];
        if (formData.lessonNames){
            formData.lessonNames.forEach((lessonName, index) => {
                lessonList.push({
                    name: lessonName,
                    description: formData.lessonDescripts[index]
                });
            })
        }
        if (!formData.type) formData.type = [];
        const course ={ name: formData.name, 
                        description: formData.description,  
                        price: formData.price,
                        courseTypes: formData.type.concat(formData['type-new']),
                        courseLessons: lessonList,
                        level: formData.level};
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
}

module.exports = new CourseController();