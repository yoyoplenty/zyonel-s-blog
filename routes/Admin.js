const express = require('express')
const app = express();
const router = express.Router();
const Admin = require('../Models/Admin')
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Global variables here as well
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.err = req.flash('err');
    next();
})

router.get('/register', forwardAuthenticated, function (req, res) {
    res.render('Register', {
        layout: 'authen.handlebars',
        Title: "Register"
    });
});

router.post('/register', forwardAuthenticated, async (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = [];
    //check fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all fields' })
    }
    //password match
    if (password !== password2) {
        errors.push({ msg: 'password does not match' })
    }
    //check password length
    if (password.length < 6) {
        errors.push({ msg: 'password should be at least 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            layout: 'authen.handlebars',
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //validation passed
        await Admin.findOne({ email: email })
            .then(admin => {
                if (admin) {
                    //admin exists
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register', {
                        layout: 'authen.handlebars',
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newAdmin = new Admin({
                        name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;
                        //set password to hash
                        newAdmin.password = hash;
                        //save admin 
                        newAdmin.save()
                            .then(admin => {
                                req.flash("success", 'you are now registered and can login in')
                                res.redirect('/admin/login')
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }))
                }
            });
    }
});

router.get('/login', function (req, res) {
    res.render('login', {
        layout: 'authen.handlebars',
        Title: "Admin login"
    });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('Dashboard', {
        Title: "Dashboard",
        name: req.body.name
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: 'dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
});
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'you are logged out');
    res.redirect('/admin/login')
})

module.exports = router;