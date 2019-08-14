const router = require('koa-router')();
const TencentController = require('../controller/tencent');


module.exports = (app) => {

    //搜索 传入每页关键词+数量+页码
    router.get('/api/tencentSoft',TencentController.softSearch);

    app.use(router.routes()).use(router.allowedMethods());
};
