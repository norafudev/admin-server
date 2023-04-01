const router = require("koa-router")()
const User = require("../models/userSchema")
const util = require("../utils/util")
const jwt = require("jsonwebtoken")

router.prefix("/users")

router.post("/login", async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    // res是数据库返回的文档，其中的_doc，是有效信息—userInfo
    const res = await User.findOne(
      {
        userName, //当key和value同名，简写
        userPwd,
      },
      "userId userName userEmail state role deptId roleList"
    )

    if (res) {
      const data = res._doc
      // 对userInfo进行加密
      let token = jwt.sign(
        {
          data,
        },
        "shanganshunli123",
        { expiresIn: 60 }
      )
      ctx.body = util.success({ ...data, token })
    } else {
      ctx.body = util.fail("用户名或密码错误")
    }
  } catch (error) {
    ctx.body = util.fail(error)
  }
})

module.exports = router
