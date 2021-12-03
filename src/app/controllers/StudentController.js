const Student = require('../models/Student');
const Account = require('../models/Account');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const ObjectId = require('mongoose').Types.ObjectId; 

class StudentController {
    //[GET] /students
    showStudents(req, res, next){
        Student.find({})
        .then(students => {
            let studentObjects = multiMongooseToObject(students);
            const studentAccountIds = studentObjects.map(studentObject => ObjectId(studentObject.account));

            Account.find({_id: {$in: studentAccountIds}})
            .then(accounts => {  
                accounts = multiMongooseToObject(accounts);
                studentObjects.forEach((studentObject, index) => {
                    if (accounts[index]){
                        studentObject.username = accounts[index].username;
                    }
                })
                res.render('students/manage',{
                    students: studentObjects,
                    user: req.user,
                })  
            })
            .catch(next);
        })
        .catch(next);
    }
}

module.exports = new StudentController();