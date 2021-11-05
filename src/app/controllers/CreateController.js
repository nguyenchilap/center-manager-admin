class CreateController {
    //[GET] /create/course
    createCourse(req, res, next){
        res.render('creates/courses');
    }

}

module.exports = new CreateController();