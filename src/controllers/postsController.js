const pool = require('../mysql');

exports.pegarTodosPosts = async (request, response) => {
    try{
        const query = "SELECT * FROM puplications"
        const result = await pool.execute(query, "request")
        return response.status(200).send(result)
    }catch(error){
        return response.status(500).send({error: error})
    };
};

exports.pegarPostEspecifico = async (request, response) => {
    try{
        const query = "SELECT * FROM puplications WHERE id_post = ?";
        const result = await pool.execute(query, request.params.id_post);
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
        return response.status(200).send(resposta);
    }catch(error){
        return response.status(500).send(error);
    };
};

exports.criarPost = async (request, response) => {
    try {
        const query = "INSERT INTO puplications (title, image, date, description, body, associetilink, categories_id_categorie) VALUES(?, ?, ?, ?, ?, ?, ?)"
        const params = [request.body.title, request.body.image, request.body.date, request.body.description, request.body.body, request.body.associetilink, request.body.categories_id_categorie]
        const result = await pool.execute(query, params);
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
    } catch (error) {
        return response.status(500).json({error: error})
    }

};

exports.alterarPost = async (request, response) => {
    try {
        const query = `UPDATE posts SET title = ?, image = ?,  date = ?, description = ?WHERE id_posts = ?`
        const params = [request.body.title, request.body.image, request.body.date, request.body.description, request.params.id_post]
        const result = await pool.execute(query, params)
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
        return response.status(202).send(resposta)
    } catch (error) {
        return response.status(500).send({error: error})
    }
};

exports.excluirPost = async (request, response) => {
    try {
        const query = "DELETE FROM puplications WHERE id_post = ?"
        const params = [request.params.id_post]
        const result = await pool.execute(query, params)
        return response.status(202).json({message: "publicação excluida com sucesso"})
    } catch (error) {
        return response.status(500).json({error})
    }
}