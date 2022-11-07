
/* This is importing the necessary packages to run the app. */
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

app.use('/uploads', express.static ('uploads'))
app.use('/css', express.static ('css'))

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
app.get('/register', async (req, res) => {
    const {firstName, lastName, email, phoneNumber, zipCode, username, password } = req.body
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    
    const user = await models.user.create({
        first_name:firstName, last_name:lastName, email:email, phone_number:phoneNumber, zip_code:zipCode, username:username, password:hashedPassword
    })

    let user_upload = await user.save()

    console.log(user_upload)

    res.render('register')
})

/*   route that is rendering the found_posts page. */
app.get('/found-posts', async (req, res) => {
    let result = await models.found_post.findAll({})
    let comments = await models.found_comment.findAll({})
    
        res.render('found_posts', {result:result, comments:comments})
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

    

    let found_animal = await models.found_post.build({
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
   res.redirect('/found-posts')
})

/* deleting the post from the database. */
app.post('/delete-post', async(req, res) =>  {
    let {id} = req.body
    await models.found_post.destroy({where:{id}})
    res.redirect('/found-posts')
}) 

app.post('/comments', async(req, res) => {
let {comment,id} = req.body

await models.found_comment.create({body:comment,found_fk:id})

    res.redirect('/found-posts')
})



app.listen(3000,() => {
    console.log('Server is running...')
})