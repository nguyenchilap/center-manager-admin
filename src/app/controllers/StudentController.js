const Student = require('../models/Student');
const studentRepo = require('../repository/StudentRepository');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

class StudentController {
    //[GET] /students
    showStudents(req, res, next){
        Student.find({})
        .then(students => {
            res.render('students/manage',{
                students: multiMongooseToObject(students),
                bannedCount: studentRepo.checkBanned(multiMongooseToObject(students)),
                user: req.user,
            })
        })
        .catch(next);
    }

    //[POST] /students/ban
    handleFormActions(req, res, next){
        switch(req.body["input-action"]){
            case 'Ban Comment':
                Student.updateMany(
                    {_id: {$in: req.body.itemIds}},
                    {$set: {'banned.comment': true}}
                )
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
                break;
            default:
                res.json({message: 'Invalid Action'});
        }
        
    }
}

module.exports = new StudentController();