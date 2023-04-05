const router = require("koa-router")()
const User = require("../models/userSchema")
const util = require("../utils/util")
const jwt = require("jsonwebtoken")

router.prefix("/users")

// 用户登录
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
        "shanganshunli123", //secret
        { expiresIn: 60 * 60 } //过期时间
      )
      ctx.body = util.success({ ...data, token })
    } else {
      ctx.body = util.fail("用户名或密码错误")
    }
  } catch (error) {
    ctx.body = util.fail(error)
  }
})

//用户列表
router.get("/list", async (ctx) => {
  const { userId, userName, state } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  // 查询条件
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  //前端传来的0代表所有状态，就不需要再根据状态查找了
  if (state && state != "0") params.state = state
  try {
    // find():按照条件进行查询，{key: 0}过滤返回的字段；返回query对象，可以用于链式调用其他查询条件和操作符
    const query = User.find(params, { _id: 0, userPwd: 0 })
    // .skip() 跳过指定数量的数据，.limit() 限制查询结果的数量
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常：${error.stack}`)
  }
})

//删除用户
router.post("/delete", async (ctx) => {
  // 待删除的用户Id数组
  const { userIds } = ctx.request.body
  console.log(userIds)
  // User.updateMany({ $or: [{ userId: 10001 }, { userId: 10002 }] })
  const res = await User.updateMany(
    { userId: { $in: userIds } },
    { $set: { state: 2 } }
  )
  if (res.nModified) {
    ctx.body = util.success(res, `共删除成功${res.nModified}条`)
    return
  }
  ctx.body = util.fail("删除失败")
})

// 用户新增、编辑
router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body
  if (action == "edit") {
    try {
      const res = await User.findOneAndUpdate(
        { userId },
        { userName, userEmail, mobile, job, state, roleList, deptId }
      )
      ctx.body = util.success(res, "编辑成功")
    } catch (error) {
      ctx.body = util.fail("更新失败：", error.stack)
    }
  }
})

module.exports = router
