const Koa = require("koa")
const app = new Koa()
const views = require("koa-views")
const json = require("koa-json")
const onerror = require("koa-onerror")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")
const log4js = require("./utils/log4")

const Router = require("koa-router")
const router = new Router()
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

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
)

// routes
// 一级路由，为后端路由加上统一的前缀/api，便于跟前端路由区分
router.prefix = "/api"
router.use(users.routes(), users.allowedMethods()) //二级路由
app.use(router.routes(), router.allowedMethods()) //注册router

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx)
  log4js.error(`${err.stack}`)
})

module.exports = app
