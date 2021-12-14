const adminRepo = require('../repository/AdminRepository');
const Manager = require('../models/Manager');

class AdminController {
    //[GET] /admin
    index(req, res, next){
        res.render('admin/create-account', {isAdmin: 1});
    }

    //[POST] /admin/create-account
    createAccount(req, res, next){
        const account = adminRepo.newAccount(req.body.username, req.body.password);
        account.save()
        .then(() => 
            res.redirect('/')
        )
        .catch(next);   
    }

    //[POST] /admin/check-username
    checkUsername(req, res, next){
        Manager.findOne({"account.username": req.body.username})
        .then(account => {
            if (account) res.json({
                exists: true,
            })
            else res.json({
                exists: false,
            })
        })
        .catch(next);
    }
}

module.exports = new AdminController();