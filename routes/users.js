const Router = require("koa-router")
const router = new Router()
const User = require("../models/userSchema")
const util = require("../utils/util")

router.prefix("/users")

router.post("/login", async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName, //当key和value同名，简写
      userPwd,
    })
    if (res) {
      ctx.body = util.success(res)
    } else {
      ctx.body = util.fail("用户名或密码错误")
    }
  } catch (error) {
    // ctx.body = util.fail(error)
    console.log(error)
  }
})

module.exports = router
