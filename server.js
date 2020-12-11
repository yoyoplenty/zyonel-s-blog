const express = require('express');
const app = express();
var exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const Homeroutes = require('./routes/home')
const Articleroutes = require('./routes/articles');
const Adminroutes = require('./routes/Admin')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')
var methodOverride = require('method-override')
let PORT = 3000 || process.env.PORT
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//passport config
require('./config/passport')(passport)
mongoose.connect('mongodb://localhost/zyonelblog', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, () => {
    console.log('Database connected')
});

var hbs = exphbs.create({
    helpers: {
        Date: function (tolocal) {
            return tolocal.toLocaleString()
        },
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
//handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

//global variable
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.err = req.flash('err');
    next();
})

app.use(Homeroutes)
app.use('/articles', Articleroutes)
app.use('/admin', Adminroutes)
app.use(methodOverride('_method'));



app.listen(PORT, () => {
    console.log(`server up and running at port ${PORT}`)
})