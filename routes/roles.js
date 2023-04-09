const router = require("koa-router")()
const Role = require("../models/RoleSchema.js")
const util = require("../utils/util.js")

router.prefix("/roles")

// 编辑用户时，获取角色名称
router.get("/allList", async (ctx) => {
  try {
    const list = await Role.find({}, "_id roleName")
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail("角色名称获取失败：" + error.stack)
  }
})

// 获取角色列表
router.get("/list", async (ctx) => {
  const { roleName } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  try {
    // 不能直接用roleName作为查询条件，如果它为空的话，数据库会返回roleName为空的文档
    let params = {}
    if (roleName) params.roleName = roleName
    const query = Role.find(params)
    const total = await Role.countDocuments(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const res = {
      page: {
        ...page,
        total,
      },
      list,
    }
    ctx.body = util.success(res, "角色列表获取成功")
  } catch (error) {
    ctx.body = util.fail("角色列表获取失败：" + error.stack)
  }
})

// 角色新增、删除、编辑
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  try {
    if (action == "create") {
      params.createTime = new Date()
      const res = await Role.create(params)
      info = "创建成功"
    } else if (action == "edit") {
      const res = await Role.findByIdAndUpdate(_id, params)
      info = "编辑成功"
    } else {
      const res = await Role.findByIdAndRemove(_id)
      info = "删除成功"
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail("操作失败：" + error.stack)
  }
})

// 角色权限设置
router.post("/update/permission", async (ctx) => {
  const { _id, permissionList } = ctx.request.body
  try {
    const res = await Role.findByIdAndUpdate(_id, { permissionList })
    ctx.body = util.success({}, "权限设置成功")
  } catch (error) {
    ctx.body = util.fail("权限设置失败：" + error.stack)
  }
})

module.exports = router
