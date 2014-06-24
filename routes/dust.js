'use strict';
global.Intl = require('intl');

var Dust   = require('dustjs-linkedin');

var getExamples = require('../lib/examples'),
    Utils       = require('../lib/utils');

require('dust-helper-intl').register(Dust);

module.exports = function (req, res, next) {
    getExamples('dust', {cache: true}).then(function (examples) {

        Object.keys(examples).forEach(function(key) {
            var example = examples[key];
            Dust.loadSource(example.compiled);
            Dust.render(example.identifier, {
                intl: res.locals.intl,
                user: {
                    firstName: 'Tilo',
                    lastName: 'Mitra',
                    numBooks: 20
                }
            }, function (err, html) {
                if (err) {
                    Utils.error(500, err);
                }
                example.rendered = html;

                //expose just the source file for each example here.
                res.expose(example.source, 'examples.dust.' + example.name);
            });
        });

        res.render('dust', {
            examples: examples
        });
    });
};
