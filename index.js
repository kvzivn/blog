var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown');


Metalsmith(__dirname)
    .use(markdown())
    .destination('./build')
    .build()