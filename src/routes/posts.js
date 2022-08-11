const express = require('express');
const router = express.Router();
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
    response.status(200).send({
        message: 'funcionou dentro da rota post',
        post: post,
    })
})

module.exports = router;