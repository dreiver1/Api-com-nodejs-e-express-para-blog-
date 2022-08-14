require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post("/cadastro", (request, response)=>{
    connection.getConnection((error, result)=>{
        if(error){return response.status(500).json({message: error})}
        bcrypt.hash(request.body.senha, 10, (error, hash)=>{
            if(error){return response.status(500).json({message: error})}
            connection.query("SELECT * FROM usuarios WHERE email = ?", [request.body.email], (error, result)=>{
                if(error){ return response.status(500).json({message: error})}
                if(result.length > 0){
                    return response.status(409).json({message: "usuario já cadastrado."})
                }else{
                    connection.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`, 
                        [request.body.email, hash], 
                        (error,  resultado)=>{
                            if(error){return response.status(500).json({message: error})}
                            var resposta = {
                                message: "usuario cadastrado com sucesso",
                                usuarioCriado: {
                                    id_usuario: resultado.insertId,
                                    email: request.body.email,
                                }
                            }
                            return response.status(201).json({resposta})
                        })
                }
            
            })
        })
    })
})

router.post("/login", (request, response)=>{
    const query = `SELECT * FROM usuarios WHERE email = ?`
    connection.getConnection((error, connection)=>{
        connection.query( query, [request.body.email], (error, result)=>{
            connection.release();
            if(error){return response.status(500).json({message: error})}
            if(result.length < 1){return response.status(401).json({message: "falha na autenticação"})}
            var userID = result[0].id_usuario
            var userEmail = result[0].email
            console.log(userEmail + userID)
            bcrypt.compare(request.body.senha, result[0].senha, (error, result) => {
                if(error){return response.status(401).json({message: "falha na autenticação"})}
                if(result){
                    const token = jwt.sign({
                        id_usuario: userID,
                        email: userEmail
                    }, process.env.JWT_KEY, {
                        expiresIn: '2h'
                    })
                    return console.log(token), response.status(200).json({
                        message: "autencado com sucesso",
                        token: token
                    })}
                if(!result){return response.status(401).json({message: "falha na autenticação"})}
            })
    })
    }) 

})

module.exports = router;