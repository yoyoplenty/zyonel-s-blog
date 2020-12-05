const express = require('express');
const app = express();
var exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const Homeroutes = require('./routes/home')
const Articleroutes = require('./routes/articles');
const mongoose = require('mongoose')
var methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/zyonelblog', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, () => {
    console.log('Database connected')
})
let PORT = 3000 || process.env.PORT
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.use(methodOverride('_method'))
app.engine('handlebars', exphbs({ handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }))
app.use(Homeroutes)
app.use('/articles', Articleroutes)
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`server up and running at port ${PORT}`)
})