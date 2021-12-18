const Student = require('../models/Student');
const Course = require('../models/Course');
const Manager = require('../models/Manager');
const passport = require('../../config/passport');

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
        const user = req.user;
        const d = user.birth.split('/');
        user.date = d[0];
        user.month = d[1];
        user.year = d[2];

        res.render('account',{
            user,
        })
    }

    //[POST] /account/edit
    editAccount(req, res, next){
        let formData = req.body;
        formData.birth = `${formData.date}/${formData.month}/${formData.year}`;
        Manager.updateOne({_id: req.user._id}, formData)
        .then(() => res.redirect('back'))
        .catch(next);
    }
}

module.exports = new SiteController();