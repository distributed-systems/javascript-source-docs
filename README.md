# javascript source docs

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/javascript-source-docs.svg)](https://greenkeeper.io/)

extracts documentation from ecma script files for complete projects

- reads jsdoc comments
- reads method signatures
- analyzes dependecies


```
const analyzer = new SourceDocs({
    path: '/path/to/source'
});


const docs = analyzer.analyze();
```