const { response } = require('express');
const express  =  require('express');
const router = require('./routes/index.js');
const app = express();

const port = process.env.PORT || 3001;

app.use('/client', router)

app.get('/', (request, response) => {
    response.json({mesage: "Servidor on"})
});


app.listen(port, ()=>{
    console.log(`servidor on na porta  http://localhost:${port}`);
});