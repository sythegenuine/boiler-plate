const {User} = require("../models/user");

let auth = (req,res,next) => {
//인증처리 하는 곳
//client 쿠키에서 토큰을 가져오기

// 토큰 복호화 한 후 유저를 찾는다
let token= req.cookies.x_auth;
//유저가 있으먄 인증ㅇㅇ
User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json ({isAuth:false, error:true})

    req.token = token
    req.user = user;
    next();
})
//유저 없으면 인증 노노
}

module.exports = { auth };