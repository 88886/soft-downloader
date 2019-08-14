const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = require('./router');
const cors = require('koa2-cors');


app.use(bodyParser());
app.use(cors({
    origin: function (ctx) {
        return "*";
        // if (ctx.url === '/') {
        //     return "*"; // 允许来自所有域名请求
        // }
        // return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

router(app);

app.listen(3001,()=>{
    console.log('Server is running 0.0.0.0:3001');
});

