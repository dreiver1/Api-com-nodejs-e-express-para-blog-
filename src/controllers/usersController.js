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
        const fazLogin = await connectionPoll.execute( query, email)
        if(fazLogin.length < 1){return response.status(401).json({message: "falha na autenticação"})}
        var userID = fazLogin[0].id_usuario
        var userEmail = fazLogin[0].email
        console.log(userEmail + userID)
        bcrypt.compare(request.body.senha, fazLogin[0].senha, (error, result) => {
            if(error){return response.status(401).json({message: "falha na autenticação"})}
            if(fazLogin){
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
            if(!fazLogin){return response.status(401).json({message: "falha na autenticação"})}
        })

    } catch (error) {
        return response.status(500).json({error: error});
    }
};