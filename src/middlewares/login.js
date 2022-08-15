
require('dotenv').config();
const { response } = require('express');
const jwt = require("jsonwebtoken")

module.exports = (request, response, next)=>{
        const token = request.headers.authorization.split(' ')[1];
        if(token.length < 1) {return response.status(500).send({message: "informe um token"})}
        jwt.verify(token, process.env.JWT_KEY, (error, decode)=>{
            if(error){ return response.status(401).json({message: "usuario ou senha invalidos"})}
            request.user = decode;
            console.log(decode)
            next();
        });     
}