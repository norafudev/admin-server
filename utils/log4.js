/**
 * 日志存储
 * @author: yachenfu
 */

const log4js = require("log4js")

const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
}

log4js.configure({
  appenders: {
    debug: { type: "stdout" },
    info: { type: "file", filename: "/logs/info_log.log" },
    error: {
      type: "dateFile",
      filename: "logs/err_logs",
      pattern: "yyyy - MM - dd.log",
      alwaysIncludePattern: true, //设置文件名为filename + pattern
    },
  },
  categories: {
    default: { appenders: ["debug"], level: "debug" },
    info: { appenders: ["debug", "info"], level: "info" },
    error: { appenders: ["debug", "error"], level: "error" },
  },
})

/**
 * 输出日志
 * @param {string} content
 */
exports.debug = (content) => {
  let logger = log4js.getLogger()
  logger.level = levels.debug
  logger.debug(content)
}

exports.info = (content) => {
  let logger = log4js.getLogger("info")
  logger.level = levels.info
  logger.info(content)
}

exports.error = (content) => {
  let logger = log4js.getLogger("error")
  logger.level = levels.debug
  logger.error(content)
}
