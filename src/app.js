const  express = require('express');
const posts = require('./routes/posts');
const usuarios = require('./routes/usuarios');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use((request, response, next) => {
    response.header('Acess-Control-Allow-Origin', '*');
    response.header(
        'Acess-Control-Allow-header',
         'Origin, X-Requested-Whidt, Content-Type, Accept, Authorization'
         );
    if(request.method === 'OPTIONS'){
        response.header('Access-Control-Allow-Headers', 'GET, POST, PUT, PATH, DELETE');
        return response.status(200).send({})
    }

    next();
});

app.use("/posts", posts);
app.use("/usuarios", usuarios);

app.use((request, respose, next)=>{
    const erro  = new Error('Paginna não encontrada');
    erro.status =  404;
    next(erro);
});

app.use((error, request, response, next)=>{
    response.status(error.status || 500);
    return response.send({
        erro: { message: error.message }
    });
});

module.exports = app;