const Koa = require("koa")
const app = new Koa()
const json = require("koa-json")
const onerror = require("koa-onerror")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")
const log4js = require("./utils/log4")
const jwt = require("jsonwebtoken")
const koaJwt = require("koa-jwt")
const util = require("./utils/util")

const router = require("koa-router")()
const users = require("./routes/users")

// error handler
onerror(app)

// 加载数据库
require("./config/mongodb")

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
)
app.use(json())
app.use(logger())
app.use(require("koa-static")(__dirname + "/public"))

// logger，输出前端请求的参数，打印后续中间件抛出的错误
app.use(async (ctx, next) => {
  log4js.info(`get_params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post_params:${JSON.stringify(ctx.request.body)}`)
  await next().catch((err) => {
    console.log("err=>" + err)
    if (err.status === 401) {
      ctx.status = 200
      ctx.body = util.fail("Token认证失败", util.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
})

// 拦截无效token
app.use(
  koaJwt({ secret: "shanganshunli123" }).unless({
    path: [/^\/api\/users\/login/], // 不用校验login路由
  })
)

// routes
router.prefix("/api") // 一级路由，为后端路由加上统一的前缀/api，便于跟前端路由区分

router.use(users.routes(), users.allowedMethods()) //二级路由
app.use(router.routes(), router.allowedMethods()) //注册router

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx)
  log4js.error(`${err.stack}`)
})

module.exports = app
