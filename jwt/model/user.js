var mysql  = require('mysql');  
const dbConfig = {     
    host     : 'localhost',       
    user     : 'root',              
    password : '123456',       
    port: '3306',                   
    database: 'blog2' 
  };

var pool = mysql.createPool(dbConfig);


module.exports = {
    findOne({username,password}){
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                const findUser = 'SELECT * FROM user WHERE name = ? and password = ?';
                connection.query(findUser, [username,password], function(err, result) {
                    if(err){
                        reject(err);
                        throw Error(err)
                    }
                    resolve(result[0]);
                    // 释放连接 
                    connection.release();
                });
            });
        });
    }
}
 
// var  addSql = 'select * from user where username=? and password= ?';
// var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];

// connection.query(addSql,addSqlParams,function (err, result) {
//         if(err){
//          console.log('[INSERT ERROR] - ',err.message);
//          return;
//         }        
 
//        console.log('--------------------------INSERT----------------------------');
//        //console.log('INSERT ID:',result.insertId);        
//        console.log('INSERT ID:',result);        
//        console.log('-----------------------------------------------------------------\n\n');  
// });
 
// connection.end();


// // let Schema = mongoose.Schema;
// // let ObjectId = Schema.Types.ObjectId;
// // let { dbUrl } = require('../config');
// // let conn = mongoose.createConnection(dbUrl);
// // let UserSchema = new Schema({
// //     username: String,
// //     password: String
// // });
// // module.exports = conn.model("User", UserSchema);