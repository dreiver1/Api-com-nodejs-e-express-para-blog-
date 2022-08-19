const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit : 1000,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: 3306
});



exports.execute = (query, params=[]) => {
    console.log("bateu aqui")
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result, fields)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
};




