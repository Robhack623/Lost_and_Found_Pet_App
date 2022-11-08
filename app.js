
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
        res.alert ( {message: 'Unable to add your animal to a database. Please, try again!'})
    }

})



app.get ('/lost-animals', async (req,res) => {
    let lost_animals = await models.lost_post.findAll({})
    let comments =await models.lost_comment.findAll({})
    for (let post of lost_animals) {
        let filteredComments = comments.filter(comment => comment.lost_fk == post.id)
        post.comment = filteredComments
    }
    res.render('lost_posts', {allAnimals:lost_animals})
    
})


app.get ('/postComment/:id', async (req,res) => {
    res.render('add_lost_comment', {id:req.params.id})
    
})

app.get('/lost-animals/:id', async (req,res) => {
    const postID = req.params.id
    const post_detail = await models.lost_post.findAll({where: {id:postID}})

    let comments =await models.lost_comment.findAll({})
    for (let post of post_detail) {
        let filteredComments = comments.filter(comment => comment.lost_fk == post.id)
        post.comment = filteredComments}
    //const comment = await models.lost_comment.findAll({where:{lost_fk:postID}})
   // let commentsArray = []
   // comment.forEach(postComment => commentsArray.push(postComment))
    console.log (post_detail[0].comment)
    let allComments = post_detail[0].comment

    res.render('all_comments_for_post', {details: post_detail, lost_comment: allComments})
    
    
})

app.get('/show-comments/:id', async (req,res) => {
    const postID = req.params.id
    const post = await models.lost_post.findOne({
        include: [
            {
                model: models.lost_comment,
                as: 'lost_comments'
            }
        ],
        where: {
            id: postID
        }
    })

    console.log (post.dataValues)
    res.render('all_comments_for_post', post.dataValues)
    
})



/*

app.get('/lost-animals/:id', async (req,res) => {
    let lost_animals = await models.lost_post.findAll({})
    const postID = req.params.id
    const post = await models.lost_post.findOne({
        include: [
            {
                model: models.lost_comment,
                as: 'lost_comments'
            }
        ],
        where: {
            id: postID
        }
    })
    console.log (post.dataValues)
    res.render('add_lost_post', {allAnimals:lost_animals, lost_comments: post.lost_comments})
    
})
*/
/*
app.get('/lost-animals/:id', async (req,res) => {
    let lost_animals = await models.lost_post.findAll({})
    const postID = req.params.id
    const post = await models.lost_post.findOne({
        include: [
            {
                model: models.lost_comment,
                as: 'lost_comments'
            }
        ],
        where: {
            id: postID
        }
    })
    console.log (post.dataValues)
    res.render('add_lost_post', {allAnimals:lost_animals, lost_comments: post.dataValues})
    
})
*/
//res.json(post)
/*
app.get('/lost-animals/:id', async (req,res) => {
    const postID = parseInt(req.params.id)
    const post = await models.lost_post.findByPk (postID, {
        include: [
            {
                model: models.lost_comment,
                as: 'lost_comments'
            }
        ]
    })
    console.log (post)
    res.render('add_lost_post', post.dataValues)
    
})
*/






app.post ('/add-comments', async (req, res) =>{
   // const postID = parseInt(req.params.id)
    const {description, id} = req.body
    let comment = await models.lost_comment.build({
        body:description,
        lost_fk:parseInt(id)
    })
    let savedComment = await comment.save()
    if(savedComment) {
        res.redirect(`/lost-animals/${id}`)
    } else {
        res.render('add_lost_comments')
    }
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