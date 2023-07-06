const Pool = require('pg').Pool;

const pool = new Pool({
    user:'vinicius',
    password:'123',
    host:'localhost',
    port:5432,
    database:'E-commerce'
})

module.exports = pool;

