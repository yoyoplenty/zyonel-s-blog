const express = require('express');
const router = express.Router();
var Articles = require('../Models/Articles')


router.get('/', (req, res) => {
    Articles.find({}, (err, articles) => {
        if (err) {
            return err
        } else {
            res.render('home', {
                Title: "Home Page",
                style: 'main.css',
                articles: articles
            })
        }
    }).sort({ createdAt: 'desc' })

})




module.exports = router