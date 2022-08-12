require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
router.get("/", (request, response) => {
    response.status(200).json(
        {
            message: 'funcionou dentro da rota posts',
        }
    );
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
            if (error) {
                return response.status(500).send({
                    message: error,
                    response: null,
                })
            }else{
                response.status(201).json(
                    {
                        Message: 'Publicação inserida com sucesso',
                        Id_post: result.insertid,
                    }
                );
            }
        })
    connection.end();
})

module.exports = router;

// "INSERT INTO posts (title, image, description, date) VALUES(?, ?, ?, ?)",
//             [post.title, post.image, post.description, post.date],
//             (error, result, field)=>{
//                 connection.release();
//                 if (error) {
//                     return response.status(500).send({
//                         message: error,
//                         response: null,
//                     })
//                 }else{
//                     response.status(201).json(
//                         {
//                             Message: 'Publicação inserida com sucesso',
//                             Id_post: result.insertid,
//                         }
//                     );

//                 }
//             }