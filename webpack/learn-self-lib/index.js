if(process.env.NODE_ENV === 'production'){
    module.exports = require('./dist/zhufengmath');
} else {
    module.exports = require('./dist/zhufengmath.min');
}