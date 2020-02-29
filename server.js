// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos

server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended: true}))


// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password:'25223515b',
    host:'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, // bolean ou booleano aceita apenas true ou false
})


// configurar apresentação da pagina
server.get("/", function(req, res) {
    
     db.query("SELECT * FROM donors", function(err, result){
         if (err) return res.send("Erro de banco de dados.")

         const donors = result.rows
         return res.render("index.html", { donors })
     })
    
})

server.post("/", function(req, res) {
    // pegar dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //regra de negocio para evitar entrada de dados vazios de name, email e blood  
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }


    // colocando valores dentro do banco de dados
    const query =    
        `INSERT INTO donors ("name", "email", "blood") 
         VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // rotina de erro
        if (err) return res.send("erro no bando de dados.")

        // fluxo ideal
        return res.redirect("/")
    })

    
})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})

