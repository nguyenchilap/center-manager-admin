const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const siteController = require('../app/controllers/SiteController');

//define route


router.post('/account/edit', siteController.editAccount);
router.get('/account', siteController.showAccount);
router.get('/', siteController.index);

//authentication
router.post('/', siteController.login);

//log-out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('back');
});
module.exports = router;