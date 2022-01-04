const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

//define route

router.post('/account/change-password', siteController.changePassword);
router.post('/account/edit', siteController.editAccount);
router.get('/account', siteController.showAccount);
router.get('/', siteController.index);

//authentication
router.post('/', siteController.login);

//log-out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
module.exports = router;