const connection = require('../mysql').pool;


exports.getAllPosts = (request, response) => {
    connection.getConnection((error, connection)=>{
        if (error) {return response.status(500).send({message: error, response: null})}
        connection.query("SELECT * FROM puplications", (error, result, field)=>{
        connection.release();
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
        return response.status(200).send(resposta)
    });
})};

exports.getPostSpecifc = (request, response) => {
    connection.getConnection((error, connection)=>{
        connection.query("SELECT * FROM puplications WHERE id_post = ?", [request.params.id_post], 
        (error, result, field)=>{
        connection.release();
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
        
        return response.status(200).send(resposta)
    })
    })
};

exports.newPost = (request, response) => {
    connection.getConnection((error, connection)=>{
        connection.query("INSERT INTO puplications (title, image, date, description, body, associetilink, categories_id_categorie) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [request.body.title, request.body.image, request.body.date, request.body.description, request.body.body, request.body.associetilink, request.body.categories_id_categorie],
        (error, result, field)=>{
            connection.release();
            if (error) {return response.status(500).send({message: error, response: null})}
            const resposta = {
                    mensagem: "publicação criada com sucesso",
                    publicacaoCriada: {
                        title: request.body.title,
                        image: request.body.image,
                        date: request.body.date,
                        description: request.body.description,
                        body: request.body.body,
                        associetilink: request.body.associetilink,
                        request: {
                            tipo: "POST",
                            descricacao: "Cria uma nova pubicação",
                            URL: "http://localhost:3000/posts",
                        }
                    }
            }        
            return response.status(201).json(resposta)
    })
    })

};

exports.pathPost = (request, response) => {
    connection.getConnection((error, connection)=>{
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
            connection.release();
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
    })
};

exports.deletePost = (request, response) => {
    connection.getConnection((error, connection)=>{
        if (error) {return response.status(500).send({message: error, response: null})}
        connection.query("DELETE FROM publications WHERE id_posts =?", [request.params.id_post], (error, result)=>{
            connection.release();
            if (error) {return response.status(500).send({message: error, response: null})}

        })
    })
    return response.status(202).json({message: "publicação excluida com sucesso"})
}