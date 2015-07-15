var Metalsmith = require('metalsmith');

Metalsmith(__dirname)
    .destination('./build')
    .build()