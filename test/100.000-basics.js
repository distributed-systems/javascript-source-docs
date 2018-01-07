'use strict';

const log = require('ee-log');
const section = require('section-tests');
const path = require('path');


section.use(new section.SpecReporter());






section('Analyzer', (section) => {
    section.test('Load the sources', async () => {
        const Analyzer = require('../');
    });



    section.test('Execute the source', async () => {
        const Analyzer = require('../');
        new Analyzer({
            projectRoot: path.join(__dirname, '../')
        });
    });
});