
/* This is importing the necessary packages to run the app. */
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs');
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')

/* mustache engine to be used in the app. */
app.engine('mustache', mustacheExpress()) 
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())

/* the session to be used in the app. */
app.use(session({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true
}))

/*  a route that is rendering the found_posts page. */
app.get('/found-posts', async (req, res) => {
let result = await models.found_animal.findAll({})
    res.render('found_posts', {result:result})
})


/*  a route that is rendering the found_posts page. */
app.post('/found-posts', async (req, res) => {
    let species = req.body.species
    let color = req.body.color
    let breed = req.body.breed
    let gender = req.body.gender
    let name = req.body.name
    let size = req.body.size
    let age = req.body.age
    let location = req.body.location
    let description = req.body.description
    let date_found = req.body.date_found


    let found_animal = await models.found_animal.build({
        species: species,
        color: color,
        breed: breed,
        gender: gender,
        name: name,
        size: size,
        age: age,
        location: location,
        description: description,
        date_found: date_found

    })
   await found_animal.save()
   res.render('found_posts')
})














/* This is the port that the app is running on. */
app.listen(3030,() => {
    console.log('Server is running...')
})