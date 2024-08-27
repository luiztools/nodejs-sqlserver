require("dotenv").config();
const port = process.env.PORT;
const connStr = process.env.CONNECTION_STRING;

const sql = require('mssql');

async function getConnection() {
    await sql.connect(connStr);
}

getConnection();

async function execSQLQuery(sqlQry) {
    const req = sql.Request()
    const { recordset } = await req.query(sqlQry);
    return recordset;
}

const express = require('express');
const app = express();

//configurando o body parser para pegar POSTS mais tarde
app.use(express.json());

//definindo as rotas
app.get('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const results = await execSQLQuery('SELECT * FROM Clientes WHERE ID=' + id);
    res.json(results);
})

app.get('/clientes/', async (req, res) => {
    const results = await execSQLQuery('SELECT * FROM Clientes');
    res.json(results);
})

app.delete('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await execSQLQuery('DELETE Clientes WHERE ID=' + id);
    res.sendStatus(204);
})

app.post('/clientes', async (req, res) => {
    const id = parseInt(req.body.id);
    const nome = req.body.nome.substring(0, 150).replaceAll("'", "");
    const cpf = req.body.cpf.substring(0, 11).replaceAll("'", "");
    await execSQLQuery(`INSERT INTO Clientes(ID, Nome, CPF) VALUES(${id},'${nome}','${cpf}')`);
    res.sendStatus(201);
})

app.patch('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const nome = req.body.nome.substring(0, 150).replaceAll("'", "");
    const cpf = req.body.cpf.substring(0, 11).replaceAll("'", "");
    await execSQLQuery(`UPDATE Clientes SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`);
    res.sendStatus(200);
})

app.use('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.listen(port, () => console.log('API funcionando!'));