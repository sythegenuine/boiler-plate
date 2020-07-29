const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/user");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {auth} =require('./middleware/auth')
const config = require('./config/key');

app.use(cookieParser());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
.then(()=>console.log('Mongodb connected'))
.catch(err => console.log(err))

//appication form url encoded
app.use(bodyParser.urlencoded({extended:true}));
//json type 분석해서 가져올 수 있게 하는 것
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello Soyeong!'))

app.get('/api/hello', (req,res)=> {
  res.send("안녕하세요~")
})

app.post('/api/users/register', (req,res)=> {
    
    //cli에서 가져오면 데베에 넣어준다
    const user = new User(req.body)

    //여기서 암호화
    user.save((err, user)=> {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
        })
    })
})


app.post("/api/users/login", (req, res) => {
    //이메일을 DB에서 요청, 비밀번호 맞는지 확인
    //비밀번호 맞으면 token을 생성하기
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당되는 유저가 없습니다",
        });
      }
      //비밀번호 맞는지
      user.comparePassword(req.body.password, user, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다",
          });
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
  
          //Token을 저장한다. 어디에? 쿠키, 로컬스토리지.
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userID: user._id });
        });
      });
    });
  });


app.get('/api/users/auth', auth, (req,res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role ===0 ? false:true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""}
        , (err, user) => {
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))