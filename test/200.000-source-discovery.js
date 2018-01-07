'use strict';


const log = require('ee-log');
const section = require('section-tests');
const path = require('path');
const assert = require('assert');




section('Source Discovery', (section) => {
    section.test('Discover source files', async () => {
        const Analyzer = require('../');
        const analyzer = new Analyzer({
            projectRoot: path.join(__dirname, '../')
        });

        await analyzer.discoverSourceFiles('src/SourceDocumentation.js');

        // make sure there are file
        assert(analyzer.files.size);
    });


    section.test('Add source files', async () => {
        const Analyzer = require('../');
        const analyzer = new Analyzer({
            projectRoot: path.join(__dirname, '../')
        });

        await analyzer.addFiles('src/SourceDocumentation.js');

        // make sure there are file
        assert.equal(analyzer.files.size, 1);
    });
});