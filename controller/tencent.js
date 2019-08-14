const tencentService = require('../service/tencent');

module.exports = {
    softSearch: async(ctx,next) => {
        ctx.response.body = await tencentService.softSearch(ctx.query.keyword, ctx.query.num, ctx.query.page);
    }
};
