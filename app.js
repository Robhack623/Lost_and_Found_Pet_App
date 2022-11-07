
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
var bcrypt = require('bcryptjs');
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')
const formidable = require ('formidable')
const {v4:uuidv4} = require ('uuid') 
const db = require('./models');




global.__basedir = __dirname

app.engine('mustache', mustacheExpress()) 
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())

app.use(session({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true
}))

app.use('/uploads', express.static ('uploads'))
app.use('/css', express.static ('css'))

app.get('/register', (req, res) =>{
    res.render('register')
})

app.post ('/register', async (req, res) =>{


    const {firstName, lastName, email, phoneNumber, zipCode, username, password } = req.body
    
    let result_username = await models.user.findAll({
        where: {
            username:username
        }
    })

    let result_email = await models.user.findAll({
        where: {
            email:email
        }
    })

    if(result_username.length === 0 && result_email.length === 0 ) {

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt)
        
        const user = await models.user.create({
            first_name:firstName, last_name:lastName, email:email, phone_number:phoneNumber, zip_code:zipCode, username:username, password:hashedPassword
        })
        let user_upload = await user.save()
        res.redirect('/login')
    } else {
        if(result_username.length >= 1 && result_email.length === 0) {
            res.render('login', {errorMessage: 'username exists dummy'})
        } else if (result_email.length >= 1 && result_username.length === 0) {
            res.render('login', {errorMessage: 'email exists dummy'})
        } else {res.render('login', {errorMessage: 'email and username exists dummy'})}
    }
})

app.get('/login', (req, res) =>{
    res.render('login')
})

app.post('/login', async (req, res) => {

    const {username, password } = req.body

    const user = await models.user.findOne({
        where: {
            username: username
        }
    })

    if(user){
        const result = await bcrypt.compare(password, user.password)
        if(result) {
            if(req.session) {
                req.session.userId = user.id
                req.session.username = user.username 
            }
            res.redirect('dashboard')
        } else {
        res.render('login', {errorMessage: 'Invalid username or password'})
    }}


})

app.get('/dashboard', authentication, (req, res) =>{
    const username = req.session.username 
    console.log('Hello, ' + username)

    res.render('dashboard', {username: req.session.username})
})

function authentication(req, res, next) {
    if(req.session) {
        if(req.session.username) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}


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

app.get('/lost_posts', authentication, async (req, res) => {
    res.render('lost_posts')
})

app.get('/add_lost_post', authentication, async (req,res)=>{
    res.render('add_lost_post')
})

app.post ('/add_lost_post', async (req,res)=>{
    let {species, color, breed, gender, name, size, age, zipCode, description, dateLost } =  req.body.species  

    let lost_animal = models.Lost_Page.build ({
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

app.get ('/lost-animals', authentication, async (req,res) => {
    let lost_animals = await models.Lost_Page.findAll({})
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