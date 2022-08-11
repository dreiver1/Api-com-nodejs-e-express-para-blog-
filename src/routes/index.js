const express = require('express');
const router = new express.Router();
router.get('/', (request, response) => {
    response.json({message: "Dentro do router"})
})

module.exports =  router;