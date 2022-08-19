require('dotenv').config();
const connectionPoll = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createNewUser = async (request, response)=>{
    try {
        const pegaUserPeloEmail = "SELECT * FROM usuarios WHERE email = ?";
        const email = [request.body.email]
        const resultFromSqlQuery = await connectionPoll.execute(pegaUserPeloEmail, email);
        console.log(resultFromSqlQuery)
        if(resultFromSqlQuery.length > 0) {return response.status(401).json({message: "Usuario já cadastrado"})}
        bcrypt.hash(request.body.senha, 10, async (error, hash)=>{
            if(error){return response.status(500).json({message: error})}
            const queryadicionaNovoUsuario = `INSERT INTO usuarios (email, senha) VALUES (?,?)`;
            const emailHash = [request.body.email, hash]
            const adicionaNovoUsuario = await connectionPoll.execute(queryadicionaNovoUsuario, emailHash)
            const resposta = {
                email: request.body.email,
                id_usuario: adicionaNovoUsuario.insertId
            }
            console.log(hash)
            return response.status(200).json(resposta)
        })
    } catch (error) {
        return response.status(500).json({error: error});
    }
}

exports.login = async (request, response)=>{

    try {
        const query = `SELECT * FROM usuarios WHERE email = ?`
        const email = [request.body.email]
        const pegaEmailSenha = await connectionPoll.execute( query, email)
        if(pegaEmailSenha.length < 1){return response.status(401).json({message: "falha na autenticação"})}
        var userID = pegaEmailSenha[0].id_usuario
        var userEmail = pegaEmailSenha[0].email
        var userPasswd = pegaEmailSenha[0].senha
        console.log(pegaEmailSenha)
        if(!pegaEmailSenha){return response.status(401).json({message: "falha na autenticação"})}
            if(bcrypt.compare(request.body.senha, userPasswd)){
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

    } catch (error) {
        return response.status(500).json({error: error});
    }
};