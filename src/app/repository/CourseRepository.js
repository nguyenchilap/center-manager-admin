const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');
const {uploadCourseImage} = require('../../config/firebase');

class CourseRepository {
    editCourse(formData){
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
        return { 
            name: formData.name, 
            description: formData.description,  
            price: formData.price,
            courseTypes: formData.type.concat(formData['type-new']),
            courseLessons: lessonList,
            level: formData.level
        };
    }
}

module.exports = new CourseRepository;