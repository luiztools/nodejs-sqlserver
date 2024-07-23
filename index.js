require("dotenv").config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const sql = require('mssql');
const connStr = process.env.CONNECTION_STRING;

//configurando o body parser para pegar POSTS mais tarde
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

router.get('/clientes/:id?', async (req, res) => {
    let filter = '';
    if (req.params.id) filter = 'WHERE ID=' + parseInt(req.params.id);
    const results = await execSQLQuery('SELECT * FROM Clientes ' + filter);
    res.json(results);
})

router.delete('/clientes/:id', async (req, res) => {
    await execSQLQuery('DELETE Clientes WHERE ID=' + parseInt(req.params.id));
    res.sendStatus(204);
})

router.post('/clientes', async (req, res) => {
    const id = parseInt(req.body.id);
    const nome = req.body.nome.substring(0, 150).replaceAll("'", "");
    const cpf = req.body.cpf.substring(0, 11).replaceAll("'", "");
    await execSQLQuery(`INSERT INTO Clientes(ID, Nome, CPF) VALUES(${id},'${nome}','${cpf}')`);
    res.sendStatus(201);
})

router.patch('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const nome = req.body.nome.substring(0, 150).replaceAll("'", "");
    const cpf = req.body.cpf.substring(0, 11).replaceAll("'", "");
    await execSQLQuery(`UPDATE Clientes SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`);
    res.sendStatus(200);
})

app.use('/', router);

app.listen(port, () => console.log('API funcionando!'));

let connection = null;
async function getConnection() {
    if (connection) return connection;

    connection = await sql.connect(connStr);
    return connection;
}

async function execSQLQuery(sqlQry) {
    const req = getConnection().request()
    const { recordset } = await req.query(sqlQry);
    return recordset;
}