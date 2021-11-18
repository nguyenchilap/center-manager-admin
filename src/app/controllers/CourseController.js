const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {multiMongooseToObject} = require('../../utils/mongoose');

class CourseController {

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

    //[GET] /courses/create/create-course
    checkTypeCourse(req, res, next){
        const formData = req.body;
        // res.json(formData);
        if (formData['type-new']){
            formData['type-new'].forEach((newType) => {
                const courseType = new CourseType({name: newType});
                courseType.save()
                .then(() => {
                    next();
                })
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
        if (!formData.img) formData.img = 'none';
        const course = new Course({ name: formData.name, 
                                    description: formData.description, 
                                    img: formData.img, 
                                    courseTypes: formData.type.concat(formData['type-new']),
                                    courseLessons: lessonList,
                                    level: formData.level});
        course.save()
        .then(() => res.redirect('back'))
        .catch(next());
    }
}

module.exports = new CourseController();