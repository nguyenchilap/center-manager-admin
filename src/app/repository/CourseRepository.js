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

    findCourseByMonthAndYear(inputMonth, inputYear){
        return Course.aggregate([
            {
                $addFields: {
                    month: {$month: '$createdAt'},
                    year: {$year: '$createdAt'},
                }
            },
            {
                $match: {
                    month: Number(inputMonth),
                    year: Number(inputYear),
                } 
            }
        ]);
    }

    findCourseByYear(inputYear){
        return Course.aggregate([
            { 
                $addFields : { year: {$year: '$createdAt'}} 
            },
            { 
                $match: { year: Number(inputYear)}
            }
        ]);
    }
}

module.exports = new CourseRepository;