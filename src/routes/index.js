const siteRouter = require('./site');
const createRouter = require('./creates');

function route(app) {
    
    app.use('/create', createRouter);

    app.use('/', siteRouter);
}

module.exports = route;