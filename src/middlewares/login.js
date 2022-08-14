require('dotenv').config();
const jwt = require("jsonwebtoken")

module.exports = (req, res)=>{
    // try {
    //     const token = request.headers.authorization.split(' ')[1];
    //     var decoded = jwt.verify(token, process.env.JWT_KEY)
    //     console.log(decoded);
    //     request.body = decoded;
    //     next();
    // } catch (error) {
    //     return response.status(401).json({message: "falha na autenticação"})
    // }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        console.log(decode)
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' });
    }

}