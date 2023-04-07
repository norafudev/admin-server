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

module.exports = router
