const Koa = require("koa")
const app = new Koa()
const views = require("koa-views")
const json = require("koa-json")
const onerror = require("koa-onerror")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")
const log4js = require("./utils/log4")

const index = require("./routes/index")
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

// logger
// app.use(async (ctx, next) => {
//   log4js.error("test")
//   await next()
// })

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx)
  log4js.error(`${err.stack}`)
})

module.exports = app
