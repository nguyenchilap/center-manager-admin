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
                bannedCount: studentRepo.countBanned(multiMongooseToObject(students)),
                user: req.user,
            })
        })
        .catch(next);
    }

    //[GET] /students/banned
    showBanned(req, res, next){
        Student.find({
            $or:[{'banned.login': true}, {'banned.comment': true}],
        })
        .then(students => {
            res.render('students/banned',{
                students: multiMongooseToObject(students),
                user: req.user,
            })
        })
        .catch(next);
    }

    //[POST] /students/handle-form-actions
    handleFormActions(req, res, next){
        switch(req.body["input-action"]){
            case 'Ban Comment':
                Student.updateMany(
                    {_id: {$in: req.body.itemIds}},
                    {$set: {
                        'banned.comment': true,
                        'banned.bannedBy': req.user.account.username,
                        'banned.bannedAt': Date.now(),
                    }}
                )
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
                break;
            case 'Ban Login':
                Student.updateMany(
                    {_id: {$in: req.body.itemIds}},
                    {$set: {
                        'banned.login': true,
                        'banned.bannedBy': req.user.account.username,
                        'banned.bannedAt': Date.now(),
                    }}
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

    //[POST] /students/banned/handle-form-actions
    handleFormActionsBanned(req, res, next){
        switch(req.body["input-action"]){
            case 'Restore':
                Student.updateMany(
                    {_id: {$in: req.body.itemIds}},
                    {$set: {
                        'banned.comment': false,
                        'banned.login': false,
                    }}
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