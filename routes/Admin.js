const express = require('express')
const router = express.Router();

router.get('/register', function (req, res) {
    res.render('Register', {
        layout: 'authen.handlebars',
        Title: "Register"
    });
});

router.get('/login', function (req, res) {
    res.render('login', {
        layout: 'authen.handlebars',
        Title: "Admin login"
    });
});

router.get('/dashboard', (req, res) => {
    res.render('Dashboard', { Title: "Dashboard" })
})


module.exports = router;