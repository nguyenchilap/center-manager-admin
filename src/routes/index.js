const siteRouter = require('./site');
const courseRouter = require('./courses');
const studentRouter = require('./students');
const adminRouter = require('./admin');
const teacherRouter = require('./teachers');


function route(app) {
    
    app.use('/admin', adminRouter);
    app.use('/students', studentRouter);
    app.use('/courses', courseRouter);
    app.use('/teachers', teacherRouter);

    app.use('/', siteRouter);
}

module.exports = route;