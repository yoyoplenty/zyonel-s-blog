const express = require('express');
const router = express.Router();
var Articles = require('../Models/Articles')


router.get('/', (req, res) => {
    Articles.find({}, (err, articles) => {
        if (err) {
            return err
        } else {
            //implementing the highest no of views to display on view
            var viewart = articles.slice(0);
            viewart.sort(function (a, b) {
                return b.views - a.views
            });
            res.render('home', {
                Title: "Home Page",
                style: 'main.css',
                articles: articles,
                views: viewart
            })
        }
    }).sort({ createdAt: 'desc' })

})




module.exports = router