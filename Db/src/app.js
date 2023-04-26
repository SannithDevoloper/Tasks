const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sannith_7464',
    database: 'mysql',
  })
  db.connect(function (err) {
    if (err) {
      return console.error('error: ' + err.message)
    }
    console.log('Database connected.')
    
  
  })
  const app = express();
  app.use(cors());
app.get('/data', function(request, result){
    db.connect();
    db.query("SELECT * FROM Company_Profile;", function(err, results, fields){
         if(err) throw err;
        result.send(results);
    })
    
})
app.listen(3000);
