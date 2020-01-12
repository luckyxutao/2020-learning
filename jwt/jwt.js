const { secret } = require('./config');
const jwt = require('jwt-simple');
const User = require('./model/user');
module.exports = async function (req, res, next) {
    let authorization = req.headers['authorization'];
    if (authorization) {
        try {
            let decoded = jwt.decode(authorization.split(' ')[1], secret);
            req.user = decoded.user;
            next();
        } catch (err) {
            console.log(err);
            res.status(401).send('Not Allowed');
        }
    } else {
        res.status(401).send('Not Allowed');
    }
}
