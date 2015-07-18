var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    layouts     = require('metalsmith-layouts'),
    glob        = require('glob'),
    Handlebars  = require('handlebars'),
    fs          = require('fs');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/layouts/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/layouts/partials/footer.hbt').toString());

Metalsmith(__dirname)
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
        pattern: ':collection/:title'
    }))
    .use(layouts('handlebars'))
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) })