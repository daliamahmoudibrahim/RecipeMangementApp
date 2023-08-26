const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
 const connection = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: 'mysql_123456',
   database:'Recipes'
 })

app.use(cors())
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: false }))
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err)
    return
  }
  console.log('Connected to the database')
})
app.post('/', (req, res) => {
  const { name, type, prepTime, photo, ingredients, way } = req.body

  connection.query(
    'INSERT INTO Recipe (recipe_name, recipe_type, recipe_prepTime, recipe_photo, recipe_ingredients, recipe_way) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, prepTime, photo, ingredients, way],
    (err, result) => {
      if (err) {
        console.error('Error executing database query:', err)
        res.status(500).json({ error: 'Failed to execute database query' })
        return
      }

      console.log('The recipe entered the database')
      res.json({
        success: 'successful',
        data: result,
      })
    }
  )
})


app.get('/', (req, res) => {
    connection.query('SELECT * from Recipe', (err, result) => {
      if (err) throw err
      console.log('Database created')
      res.status(200).send(result)
    })
})


app.get('/search', (req,res)=>{
  const search = req.query.term;
  const query = 'SELECT * From Recipe WHERE recipe_name LIKE ?'
  console.log(search);

  connection.query(query , ['%' + search + '%'], (err,result)=>{
    if (err) {
      console.error('Error executing database query:', err)
      res.status(500).json({ error: 'Failed to execute database query' })
      return
    }

    res.json(result)
  })
})

app.listen(8000,'127.0.0.1',()=>{
    console.log('app listen in port 8000');
})


