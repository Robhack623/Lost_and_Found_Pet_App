
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs');
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')
const formidable = require ('formidable')
const {v4:uuidv4} = require ('uuid') 


global.__basedir = __dirname


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


app.use('/uploads', express.static ('uploads'))
app.use('/css', express.static ('css'))

function uploadFile(req, callback) {
    new formidable.IncomingForm ().parse (req)
    .on('fileBegin', (name, file) => {
        console.log(file)
        uniqueFileName = `${uuidv4()}.${file.originalFilename.split(".").pop()}`;
        file.name = uniqueFileName
        file.filepath = __basedir + '/uploads/' + file.name
        console.log(file)

    })
    .on ('file', (name, file) => {
        callback(file.name)

    })
}

app.post('/upload', (req, res) => {
    uploadFile(req,(photoURL) => {
        photoURL = `/uploads/${photoURL}`
        res.render('add_lost_post', {imageURL: photoURL, className: 'pet-preview-image'})

    })
})

app.get('/add_lost_post', async (req,res)=>{
    res.render('add_lost_post')
})

app.post ('/add_lost_post', async (req,res)=>{
    let species =  req.body.species
    let color =  req.body.color
    let breed =  req.body.breed
    let gender =  req.body.gender
    let name =  req.body.name
    let size =  req.body.size
    let age =  parseInt(req.body.age)
    let zipCode =  req.body.zipCode
    let description =  req.body.description
    let dateLost =  req.body.dateLost
    

    let lost_animal = models.lost_post.build ({
            species: species, 
            color: color,
            breed: breed,
            gender: gender,
            name: name, 
            size: size, 
            age: age, 
            zip_code: zipCode, 
            description: description, 
            pet_pic: uniqueFileName, 
            date_lost: dateLost            
    })

    let upload_lost_animal = await lost_animal.save()
    if (upload_lost_animal != null) {
        res.redirect('/lost-animals')
    } else {
        res.send ( {message: 'Unable to add your animal to a database. Please, try again!'})
    }

})

app.get ('/lost-animals', async (req,res) => {
    let lost_animals = await models.lost_post.findAll({})
    res.render('add_lost_post', {allAnimals:lost_animals})
    
})



/*
app.post('/add-posts', async (req, res) => {
    const {title, description, createdName, published } = req.body 

     // create the movie object 
    const post = models.Post.build({
        title: title, 
        description: description, 
        created: createdName, 
        published: published
    })
    // save the movie 
    await post.save()
    res.redirect ('/')
})

*/









app.listen(3000,() => {
    console.log('Server is running...')
})