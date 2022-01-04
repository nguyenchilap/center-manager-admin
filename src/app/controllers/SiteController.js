const Student = require('../models/Student');
const Course = require('../models/Course');
const Manager = require('../models/Manager');
const passport = require('../../config/passport');
const bcrypt = require('bcryptjs');

const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

class SiteController {
    //[GET] /
    index(req, res, next){
        Promise.all([Course.countDocuments(), Student.countDocuments()])
        .then(([countCourse, countStudent]) => {
            res.render('home', {
                user: req.user,
                countCourse,
                countStudent
            });
        })
        .catch(next);
    }

    //[POST] /
    login(req, res, next){
        passport.authenticate('localLogin', function(error, user, info){
            if (error) next(error);
            if (!user){
                res.json({notiMessage: info.message})
            }
            req.logIn(user, function(err){
                if (err) next(err);
                else res.json({
                    user,
                    redirect: '/',
                    notiMessage: 'Login accessed!!!'
                })
            })
        })(req, res, next);
    }

    //[GET] /account
    showAccount(req, res, next){
        Manager.findOne({_id: req.user._id})
        .then(user => {
            const manager = mongooseToObject(user);
            const d = manager.birth.split('/');
            manager.date = d[0];
            manager.month = d[1];
            manager.year = d[2];
            res.render('account', {user: manager});
        })
        .catch(next);
    }

    //[POST] /account/edit
    editAccount(req, res, next){
        let formData = req.body;
        formData.birth = `${formData.date}/${formData.month}/${formData.year}`;
        Manager.updateOne({_id: req.user._id}, formData)
        .then(() => res.redirect('back'))
        .catch(next);
    }

    //[POST] /account/change-password
    changePassword(req, res, next){
        if (!bcrypt.compareSync(req.body.password, req.user.account.password))
            res.json({
                success: 0,
                notiMessage: 'Un-correct current password !! Please try again.'
            })
        Manager.updateOne({_id: req.user._id}, {'account.password' : bcrypt.hashSync(req.body.newPassword)})
        .then(() => res.json({
            success: 1,
            notiMessage: 'Password has been changed successfully !! You are about to be logged out.'
        }))
        .catch(() => res.json({
            success: 0,
            notiMessage: 'Failed !! Something went wrong.'
        }));
    }
}

module.exports = new SiteController();