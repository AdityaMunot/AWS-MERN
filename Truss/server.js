const express = require('express'); /* express is a module of node to make routes to database*/
const app = express();/* initialize Express*/

const morgan = require('morgan');
app.use(morgan('short')); // short - for short log output // combined - for detailed log output

//require mysql in node modules to use it
const mysql = require('mysql');

const PORT = process.env.PORT || 3000;/* set the port to 3000 or let the process set the port*/

var connString = 'mysql://root:root@localhost/scheduling?charset=utf8_general_ci&timezone=-0700';
var conn = mysql.createConnection(connString);

conn.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
  })

/*Start the server*/
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

app.get("/", (req, res) => {
    console.log("responfing to root route");
    res.send("hello from ROOT")
})

app.get("/users", (req, res) => {
    var user1 = {firstName : "Stephen", lastname: "Curry"}
    var user2 = {firstName : "Stephen", lastname: "Curry"}
    res.json([user1,user2])
    //res.send("Nodemon auto updates when i save this file")
})

app.get('/user/:id', (req, res) => {
    console.log("Fetching user with student_id: " + req.params.id)

    const userId = req.params.id;
    const queryString = "SELECT * FROM students WHERE student_id = ?"

    conn.query(queryString, [userId], (err, rows, fields) => {
        
        if(err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            res.end()
            return
        }
        else {
        console.log("I think we fetched  userd successfully")

        const users = rows.map((row) => {
            return { Student_Id: row.student_id, Passwords: row.password}
        })
        res.json(users)
        }
    })
    //res.end()
})