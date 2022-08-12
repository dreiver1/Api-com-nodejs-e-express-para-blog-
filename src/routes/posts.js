require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
router.get("/", (request, response) => {
    // response.status(200).json(
    //     {
    //         message: 'funcionou dentro da rota posts',
    //     }
    // );
    connection.connect();
    connection.query("SELECT * FROM posts", 
        (error, result, field)=>{
        if (error) {return response.status(500).send({message: error, response: null})}
        return response.status(200).send({response: result})
    })
});

router.post("/", (request, response) => {
    const post = {
        title: request.body.title,
        image: request.body.image,
        description: request.body.description,
        date: request.body.date,
    }

    connection.connect();
    connection.query(
        "INSERT INTO posts (title, image, date, description) VALUES(?, ?, ?, ?)",
        [post.title, post.image, post.date, post.description],
        (error, result, field)=>{
            if (error) {return response.status(500).send({message: error, response: null})}
            response.status(201).json(
                {
                    Message: 'Publicação inserida com sucesso',
                    Id_post: result.insertid,
                }
                
            )}
    )
    connection.end();
})

module.exports = router;