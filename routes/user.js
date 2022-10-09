var express = require('express');
var router = express.Router();//创建router实例

const { login } = require('../controller/user');
const { SuccessModal, ErrorModal } = require('../model/resModel');

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then(data => {
    if (data.username) {
      //设置session
      req.session.username = data.username;
      req.session.realname = data.realname;
      res.json(new SuccessModal())
      return;
    }
    res.json(new ErrorModal('登陆失败'))
  })
});

// router.get('/login-test', (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       errno:0,
//       msg:'测试成功'
//     })
//   }
//   res.json({
//     errno:-1,
//     msg:'未登陆'
//   })
// })

// router.get('/session-test', (req, res, next) => {
//   const session = req.session;
//   if (session.viewNum == null) {
//     session.viewNum = 0
//   }
//   session.viewNum++;
//   res.json({
//     viewNum: session.viewNum
//   })
// })

module.exports = router;
