const soft360Service = require('../service/360');

module.exports = {
    softSearch: async(ctx,next) => {
        ctx.response.body = await soft360Service.softSearch(ctx.query.keyword);
    }
};
