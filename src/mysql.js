const mysql = require('mysql');
const Pool = mysql.createPool({
    connectionLimit : 1000,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: 3306
});



exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        Pool.query(query, params, (error, result, fields)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
};

exports.pool = Pool; 


