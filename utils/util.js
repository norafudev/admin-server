/**
 * 通用结构
 */

import log4js from "./log4"

// 状态码
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, //参数错误
  USER_ACCOUNT_ERROR: 20001, //账号或密码错误
  USER_LOGIN_ERROR: 30001, //用户未登录
  BUSSINESS_ERROR: 40001, //业务请求失败
  AUTH_ERROR: 50001, //认证失败或token过期
}

/**分页功能
 * @param {number} pageNum
 * @param {number} pageSize
 * */

module.exports = {
  pager({ pageNum = 1, pageSize = 10 }) {
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: { pageNum, pageSize },
      skipIndex,
    }
  },
  sucess(data = "", msg = "", code = CODE.SUCCESS) {
    log4js.debug(data)
    return { code, data, msg }
  },
  fail(data = "", msg = "", code = CODE.BUSSINESS_ERROR) {
    log4js.error(msg)
    return { code, data, msg }
  },
}
