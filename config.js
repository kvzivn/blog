var prod = {
        'sitename': 'Kevin Ivan Blog',
        'baseUrl': 'http://www.kevinivan.com/blog',
        'description': 'My personal blog',
        'isDev': false,
        'twitter': 'kevzivan',
        'github': 'kvzivn'
    },
    dev = {
        'sitename': 'Kevin Ivan Blog',
        'baseUrl': 'http://localhost:3000/',
        'description': 'My personal blog',
        'isDev': false,
        'twitter': 'kevzivan',
        'github': 'kvzivn'
    };

module.exports = function(args) {
    'use strict';
    var config = dev;

    args.forEach(function(val) {
        if (val === '--prod' || val === '-p') {
            config = prod;
        }
    });

    return config;

};