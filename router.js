const router = require('koa-router')();
const tencentRouter = require('./router/tencent');
const soft360Router = require('./router/360');

module.exports = (app) => {
    soft360Router(app);
    tencentRouter(app);
    app.use(router.routes()).use(router.allowedMethods());
};
