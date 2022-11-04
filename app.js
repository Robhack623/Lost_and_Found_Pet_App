
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs');
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')

app.engine('mustache', mustacheExpress()) 
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())

app.use(session({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true
}))

app.get('/register', (req, res) =>{
    res.render('register')
})

app.post ('/register', async (req, res) =>{

    const {username, password } = req.body
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)

    res.redirect('/login')
})

app.get('/login', (req, res) =>{
    res.render('login')
})














app.listen(8080,() => {
    console.log('Server is running...')
})