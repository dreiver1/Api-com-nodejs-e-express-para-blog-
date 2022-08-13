require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post("/", (request, response)=>{
    connection.connect((error, result)=>{
        if(error){return response.status(500).json({message: error})}
        bcrypt.hash(request.body.senha, 10, (error, hash)=>{
            if(error){return response.status(500).json({message: error})}
            connection.query("SELECT * FROM usuarios WHERE email = ?", [request.body.email], (error, result)=>{
                if(error){return response.status(500).json({message: error})}
                if(result.length > 0){
                    connection.end();
                    return response.status(409).json({message: "usuario já cadastrado."})
                }else{
                    connection.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`, 
                        [request.body.email, hash], 
                        (error, resultado)=>{
                            var resposta = {
                                message: "usuario cadastrado com sucesso",
                                usuarioCriado: {
                                    id_usuario: resultado.insertId,
                                    email: request.body.email,
                                }
                            }
                            connection.end();
                            if(error){return response.status(500).json({message: error})}
                            return response.status(201).json({resposta})
                        })
                    connection.end();
                    
                }
            })
        })
    });
     
    
})


module.exports = router;