var Metalsmith      = require('metalsmith'),
    markdown        = require('metalsmith-markdown'),
    collections     = require('metalsmith-collections'),
    permalinks      = require('metalsmith-permalinks'),
    layouts         = require('metalsmith-layouts'),
    glob            = require('glob'),
    Handlebars      = require('handlebars'),
    HandlebarsIntl  = require('handlebars-intl'),
    ignore          = require('metalsmith-ignore'),
    fs              = require('fs'),
    metadata        = require('./config')(process.argv),
    moment          = require('moment'),
    date            = require('metalsmith-build-date'),
    hljs            = require('highlight.js');

HandlebarsIntl.registerWith(Handlebars);
Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/layouts/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/layouts/partials/footer.hbt').toString());

Handlebars.registerHelper('link', function(path) {
    return metadata.baseUrl + path;
});

Handlebars.registerHelper('date', function(date) {
    return moment(date).format('Do MMMM YYYY');
});

Metalsmith(__dirname)
    .use(ignore('src/stylesheets'))
    .use(collections({
        pages: {
            pattern: 'pages/*.md'
        },
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown({
        gfm: true,
        tables: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code, lang, callback) {
            return hljs.highlightAuto(code).value
        }
    }))
    .use(permalinks({
        pattern: ':collection/:title',
        relative: true
    }))
    .use(layouts('handlebars'))
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) })