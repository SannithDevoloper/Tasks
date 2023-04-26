const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyparser = require('body-parser')
const readXlsxFile = require('read-excel-file/node')
const mysql = require('mysql2')
const multer = require('multer')
const app = express()
app.use(express.static('./public'))
app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
)
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  },
})
const uploadFile = multer({ storage: storage })
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  res.send('File imported successfully')
})

app.post('/import-excel', uploadFile.single('import-excel'), (req, res) => {
  importFileToDb(__dirname + '/uploads/' + req.file.filename)
   console.log(res)
})
function importFileToDb(exFile) {
  readXlsxFile(exFile).then((rows) => {
    rows.shift();
  db.connect((error) => {
      if (error) {
        console.error(error)
      } else {
        let query = 'INSERT INTO Company_Profile (`COMPANY NUMBER`, `COMPANY NAME`,`COMPANY TYPE`,`DATE OF INCORPORATION`,`COUNTRY OF INCORPORATION`,`WEBSITE`,`EMAIL`,`TELEPHONE`,`SUBSIDIARIES (Y/N)`,`SUBSIDARY COMPANY NUMBERS LIST(comma separated)`,`AUTHORISED REPRESENTATIVE NUMBER`,`AUTHORISED REPRESENTATIVE NAME`,`REGISTERED AGENT NUMBER`,`REGISTERED AGENT NAME`,`CONTRIBUTED CAPITAL`,`IMPOSITION CONDITIONS`,`RISK RATING`,`IMPACT ASSESSMENT`,`BUCKET PLACEMENT`,`REGULATORY DEPOSIT`,`DOMESTIC BUSINESS TRUST`,`PROFESSIONAL INDEMNITY (Y/N)`,`PROFESSIONAL INDEMNITY AMOUNT`,`ADDITIONAL DETAILS`,`REGISTERED OFFICE ADDRESS 1`,`REGISTERED OFFICE ADDRESS 2`,`REGISTERED OFFICE ADDRESS CITY`,`REGISTERED OFFICE ADDRESS STATE`,`REGISTERED OFFICE ADDRESS COUNTRY`,`REGISTERED OFFICE ADDRESS ZIPCODE`) VALUES ?'
        db.query(query, [rows], (error, response) => {
          console.log(error || response)
        })
      }
    })
  })
}
let nodeServer = app.listen(4000, function () {
  let port = nodeServer.address().port
  let host = nodeServer.address().address
  console.log('App working on: ', host, port)
})