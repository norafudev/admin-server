/**
 * 连接数据库
 */
const log4js = require("../utils/log4")
const config = require("./index")

const mongoose = require("mongoose")
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

// 监听数据库是否连接成功
const db = mongoose.connection

db.on("error", (error) => {
  log4js.error(`***数据库连接失败:${error}***`)
})
db.on("open", () => {
  log4js.info("***数据库连接成功***")
})
