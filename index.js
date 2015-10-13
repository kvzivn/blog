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
    metadata        = require('./config')(process.argv);

HandlebarsIntl.registerWith(Handlebars);
Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/layouts/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/layouts/partials/footer.hbt').toString());

Handlebars.registerHelper('link', function(path) {
    return metadata.baseUrl + path;
});

Metalsmith(__dirname)
    .use(ignore('stylesheets'))
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
    .use(markdown())
    .use(permalinks({
        pattern: ':collection/:title',
        relative: true
    }))
    .use(layouts('handlebars'))
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) })