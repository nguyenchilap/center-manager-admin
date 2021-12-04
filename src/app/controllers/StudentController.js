const Student = require('../models/Student');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const ObjectId = require('mongoose').Types.ObjectId; 

class StudentController {
    //[GET] /students
    showStudents(req, res, next){
        Student.find({})
        .then(students => {
            res.render('students/manage',{
                students: multiMongooseToObject(students),
                user: req.user,
            })
        })
        .catch(next);
    }
}

module.exports = new StudentController();