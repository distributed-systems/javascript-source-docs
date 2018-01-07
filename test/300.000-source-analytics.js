'use strict';


const log = require('ee-log');
const section = require('section-tests');
const path = require('path');
const assert = require('assert');




section('Source Analytics', (section) => {
    section.test('Analyze source files', async () => {
        const Analyzer = require('../');
        const analyzer = new Analyzer({
            projectRoot: path.join(__dirname, '../')
        });

        await analyzer.discoverSourceFiles('src/SourceDocumentation.js');

        // make sure there are file
        const docs = await analyzer.analyze();
        assert(docs);
        assert(docs.length);

        const mainDocs = docs.find(f => f.fileName === 'src/SourceDocumentation.js');
        const mainClass = mainDocs.classes.find(d => d.name === 'SourceDocumentation');

        assert(mainClass);
        assert.equal(mainClass.name, 'SourceDocumentation');
        assert.equal(mainClass.methods.length, 4);

        const constructor = mainClass.methods.find(m => m.name === 'constructor');

        assert(constructor.parameters);
        assert.equal(constructor.parameters.length, 1);
        assert(constructor.parameters[0].values);
        assert.equal(constructor.parameters[0].values.length, 1);
        assert.equal(constructor.parameters[0].values[0].name, 'projectRoot');
    });
});