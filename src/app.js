const  express = require('express');
const posts = require('./routes/posts');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use("/posts", posts);

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
})

module.exports = app;