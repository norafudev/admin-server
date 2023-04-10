const router = require("koa-router")()
const util = require("./../utils/util")
const Dept = require("./../models/deptSchema")

router.prefix("/dept")

// 部门树形列表
router.get("/list", async (ctx) => {
  let { deptName } = ctx.request.query
  let params = {}
  if (deptName) params.deptName = deptName
  let rootList = await Dept.find(params)
  ctx.body = util.success(rootList)
})

// 部门操作：创建、编辑、删除
router.post("/operate", async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info
  try {
    if (action == "create") {
      await Dept.create(params)
      info = "创建成功"
    } else if (action == "edit") {
      params.updateTime = new Date()
      await Dept.findByIdAndUpdate(_id, params)
      info = "编辑成功"
    } else if (action == "delete") {
      await Dept.findByIdAndRemove(_id)
      await Dept.deleteMany({ parentId: { $all: [_id] } })
      info = "删除成功"
    }
    ctx.body = util.success("", info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

module.exports = router
