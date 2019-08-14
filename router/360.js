const router = require('koa-router')();
const soft360Controller = require('../controller/360');


module.exports = (app) => {
    router.get('/api/360Soft',soft360Controller.softSearch);
    app.use(router.routes()).use(router.allowedMethods());
};
