const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

class CourseController {

    //[GET] /courses/
    showCourses(req, res, next){
        Course.find({})
        .then(courses => {
            res.render('courses/manage', {
                courses: multiMongooseToObject(courses),
            });
        })  
        .catch(next);   
    }

    //[GET] /courses/create
    showForm(req, res, next){
        CourseType.find({})
        .then(courseTypes => {
            res.render('courses/create', {
                courseTypes: multiMongooseToObject(courseTypes),
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
                .catch(next());
            })
        }
        else next();
    }

    create(req, res, next){
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
        if (!req.file) formData.img = 'none';
        else {
            const d = new Date();
            formData.img = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + "-" + formData.name + "/" + req.file.originalname;
        }
        const course = new Course({ name: formData.name, 
                                    description: formData.description, 
                                    img: formData.img, 
                                    price: formData.price,
                                    courseTypes: formData.type.concat(formData['type-new']),
                                    courseLessons: lessonList,
                                    level: formData.level});
        course.save()
        .then(() => res.redirect('courses/'))
        .catch(next);
    }

    // [GET] /courses/:id/edit
    showCourse(req, res, next){
        CourseType.find({})
        .then((types) => {
            Course.findOne({_id: req.params.id})
            .then((course) => {
                res.render('courses/edit', {
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
        Course.updateOne({_id: req.params.id}, {img: `${req.body['img-folder']}/${req.file.originalname}`})
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
    }
}

module.exports = new CourseController();