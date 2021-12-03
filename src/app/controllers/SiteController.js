Manager = require('../models/Manager');

class SiteController {
    //[GET] /
    index(req, res, next){
        res.render('home', {
            notiMessage: req.query.notiMessage,
            user: req.user,
        });
    }

    //[POST] /
    login(req, res, next){
        Manager.findOne({_id: req.user._id})
        .then(manager => {
            res.redirect('back');
        })
        .catch(next);
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