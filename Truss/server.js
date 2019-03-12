const express = require('express'); /* express is a module of node to make routes to database*/
//require mysql in node modules to use it
const mysql = require('mysql');

const PORT = process.env.PORT || 3000;/* set the port to 3000 or let the process set the port*/

const app = express();/* initialize Express*/

const connection = mysql.createConnection({
    host: 'localhost' ,
    user: 'user',
    password: '2019admin',
    database: 'stevens_records'
});

connection.connect(function(err){
    (err)? console.log(err): console.log(connection);
});

require('./routes/html-routes')(app, connection);/*HTML route (require from routes file and pass in Express app)*/
/*Start the server*/
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
