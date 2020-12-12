const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);
const stripHtml = require('string-strip-html');

///initialize plugin
mongoose.plugin(slug);

const Articles = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    snippet: {
        type: String,
    },
    img: {
        type: String,
        default: "zyonel.jpg",
        required: false
    },
    views: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        slug: 'title',
        unique: true,
        slug_padding_size: 2
    }
})

Articles.pre('validate', function (next) {
    //check if there is a description
    if (this.description) {
        this.description = htmlPurify.sanitize(this.description);
        this.snippet = stripHtml(this.description.substring(0, 200)).result;
    }

    next();
})

module.exports = mongoose.model('articles', Articles)