const express = require('express');
const jwt = require('jwt-simple');
const bodyParser = require('body-parser');
const moment = require('moment');
const User = require('./model/user');
const jwtWare = require('./jwt');
const { secret } = require('./config');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/signup', async function (req, res) {
    let user = req.body;
    user = await User.create(user);
    if (user) {
        res.json({
            code: 0,
            data: {
                user
            }
        });
    } else {
        res.json({
            code: 1,
            data: '用户注册失败'
        });
    }
});
app.post('/login', async function (req, res) {
    const reqUser = req.body;
    const user = await User.findOne(reqUser);
    if (user) {
        console.log(user)
        let expires = moment().add(7, 'days').valueOf();
        let userInfo = {
            id: user.id,
            username: user.name
        };
        let token = jwt.encode({
            user: userInfo,
            exp: expires
        }, secret);
        res.json({
            code: 0,
            data: {
                token,
                expires,
                user: userInfo
            }
        });
    } else {
        res.json({
            code: 1,
            data: '用户名或密码错误'
        });
    }
});
app.get('/user', jwtWare, function (req, res) {
    res.json({
        code: 0,
        data: {
            user: req.user
        }
    });
});
app.listen(8080);