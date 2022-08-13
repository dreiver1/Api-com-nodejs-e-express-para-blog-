require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;

router.get("/", (request, response) => {
    connection.connect();
    connection.query("SELECT * FROM posts",
        (error, result, field)=>{
        if (error) {return response.status(500).send({message: error, response: null})}
        const resposta = {
            quantidade: result.length,
            posts: result.map(post=>{
                return {
                    title: post.title,
                    image: post.image,
                    date: post.date,
                    description: post.description,
                    request: {
                        tipo: "GET",
                        description: "Retorna todas as postagens",
                        URL: "http://localhost:3000/posts/" + post.id_posts,
                    }
                };
            })        
        };
        return response.status(200).send({resposta})
    })
    connection.end();
});

router.get("/:id_post", (request, response) => {
    connection.connect();
    connection.query("SELECT * FROM posts WHERE id_posts = ?", [request.params.id_post], 
        (error, result, field)=>{
        if (error) {return response.status(500).send({message: error, response: null})}
        if (result.length == 0){return response.status(404).send({message: "pagina não encontrada"})}
        const resposta = result.map( post => {
                            return{
                                title: post.title,
                                image: post.image,
                                date: post.date,
                                description: post.description,
                                request: {
                                    tipo: "GET",
                                    description: "Retorna uma postagem + detalhada",
                                    URL: "http://localhost:3000/posts",     
                                }      
                            }
                        })
        
        return response.status(200).send({resposta})
    })
    connection.end();
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
        [request.body.title, request.body.image, request.body.date, request.body.description],
        (error, result, field)=>{
            if (error) {return response.status(500).send({message: error, response: null})}
            const resposta = {
                    mensagem: "publicação criada com sucesso",
                    publicacaoCriada: {
                        title: request.body.title,
                        image: request.body.image,
                        date: request.body.date,
                        description: request.body.description,
                        request: {
                            tipo: "POST",
                            descricacao: "Cria uma nova pubicação",
                            URL: "http://localhost:3000/posts",
                        }
                    }
                
            }        
            return response.status(201).json({resposta})
    })
    connection.end();
});

router.put("/:id_post", (request, response) => {
    connection.connect();
    connection.query(`
    UPDATE posts 
    SET title = ?, 
        image = ?,  
        date = ?, 
        description = ?
        WHERE id_posts = ?
    `,
    [request.body.title, request.body.image, request.body.date, request.body.description, request.params.id_post], 
    (error, result) => {
        if (error) {return response.status(500).send({message: error, response: null})}

        const resposta = {
            mensagem: "publicação Alterada com sucesso",
            publicacaoCriada: {
                title: request.body.title,
                image: request.body.image,
                date: request.body.date,
                description: request.body.description,
                request: {
                    tipo: "PUT",
                    descricacao: "Altera uma pubicação",
                    URL: "http://localhost:3000/posts/" + request.params.id_post,
                }
            }
        
        }        
        return response.status(202).json({resposta})
    });
    connection.end();
});

router.delete("/:id_post", (request, response) => {
    connection.connect();
    connection.query("DELETE FROM posts WHERE id_posts =?", [request.params.id_post]);
    connection.end();
    return response.status(202).json({message: "publicação excluida com sucesso"})
});

module.exports = router;