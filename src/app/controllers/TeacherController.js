const Manager = require('../models/Manager');

class TeacherController {
    //[GET] /teachers/create
    showCreateTeachers(req, res, next){
        Manager.findOne({_id: req.user._id})
        .then(user => {
            res.render('teachers/create', {
                user
            });
        })
    }
}

module.exports = new TeacherController();