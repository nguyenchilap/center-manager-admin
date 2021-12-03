const bcrypt = require('bcryptjs');
const Manager = require('../models/Manager');

class AdminController {
    //[GET] /admin
    index(req, res, next){
        res.render('admin/create-account', {
        });
    }

    //[POST] /admin/create-account
    createAccount(req, res, next){
        const formData = req.body;
        const hashedPassword = bcrypt.hashSync(formData.password, 10);

        const account = new Manager({
            account: {
                username: formData.username,
                password: hashedPassword,
            }
        })

        account.save()
        .then(() => {res.redirect('/')})
        .catch(next);
    }
}

module.exports = new AdminController();