const express = require('express');
const app = express();
const router = express.Router();
var Articles = require('../Models/Articles')
const multer = require('multer');
const path = require('path')
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

app.use(express.urlencoded({ extended: false }))

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './public/uploads');
    },
    filename: async function (request, file, callback) {
        if (request.Articles) {
            return callback(null, request.Articles.id.toString());
        }
        return callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

router.get('/add', (req, res) => {
    res.render('Add')
})

router.get('/edit/:slug', ensureAuthenticated, async (req, res) => {
    await Articles.findOne({ slug: req.params.slug }, (err, articles) => {
        if (err) {
            return err
        } else {
            res.render('editArticle', {
                articles: articles,
                Title: articles.title
            })
        }
    })
})

router.put('/:id', upload.single('file'), async (req, res) => {
    req.articles = await Articles.findById(req.params.id);
    let articles = req.articles;
    articles.title = req.body.title
    articles.author = req.body.author
    articles.description = req.body.description
    articles.img = req.file.filename
    try {
        articles = await articles.save()
        res.redirect('/articles/' + articles.slug)
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/:slug', async (req, res) => {
    await Articles.findOne({ slug: req.params.slug }, (err, articles) => {
        if (err) {
            return err
        } else {
            res.render('eachArticle', {
                articles: articles,
                Title: articles.title
            })
        }
    })
})


router.post('/', upload.single('file'), async (req, res) => {
    let articles = new Articles({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        img: req.file.filename
    })
    try {
        articles = await articles.save()
        res.redirect('/articles/' + articles.slug)
    }
    catch (err) {
        console.log(err)
    }
})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})



module.exports = router;