var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown');

Metalsmith(__dirname)
    .use(markdown())
    .destination('./dist')
    .build(function (err) { if(err) console.log(err) })