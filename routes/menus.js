const router = require("koa-router")()
const Menu = require("../models/menuSchema")
const util = require("../utils/util")

router.prefix("/menu")

// 菜单列表
router.get("/list", async (ctx) => {
  const { menuState, menuName } = ctx.request.query
  const params = {}
  if (menuName) params.menuName = menuName
  if (menuState) params.menuState = menuState
  let rootList = (await Menu.find(params)) || []
  ctx.body = util.success(rootList)
})

// 菜单新增、编辑、删除
router.post("/operate", async (ctx) => {
  const { action, _id, ...params } = ctx.request.body
  let info
  //   新增
  try {
    if (action == "add") {
      const res = await Menu.create(params)
      info = "创建成功"
      // 编辑
    } else if (action == "edit") {
      const res = await Menu.findOneAndUpdate({ _id: _id }, params)
      info = "编辑成功"
      params.updateTime = new Date()
      // 删除
    } else {
      const res = await Menu.findByIdAndRemove(_id)
      await Menu.deleteMany({ parentId: { $all: [_id] } })
      info = "删除成功"
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail(`菜单操作失败：${error.stack}`)
  }
})

module.exports = router
