require("dotenv").config();
const connStr = process.env.CONNECTION_STRING;
const sql = require("mssql");

async function createTable() {
   try {
      await sql.connect(connStr);
      const table = new sql.Table('Clientes');
      table.create = true;
      table.columns.add('ID', sql.Int, { nullable: false, primary: true });
      table.columns.add('Nome', sql.NVarChar(150), { nullable: false });
      table.columns.add('CPF', sql.NChar(11), { nullable: false });
      table.rows.add(1, 'teste1', '12345678901');
      table.rows.add(2, 'teste2', '09876543210');
      table.rows.add(3, 'teste3', '12312312399');

      const request = new sql.Request();
      
      await request.bulk(table);
      console.log('funcionou');
   } catch (err) {
      console.error(err);
   }
}

createTable();