'use strict';

const type = require('ee-types');
const log = require('ee-log');
const path = require('path');
const InvalidArgumentException = require('./errors/InvalidArgumentException');
const SourceDiscovery = require('./SourceDiscovery');
const ClassAnalyzer = require('./ClassAnalyzer');
const Parser = require('./Parser'); 



/**
* creates documentation for all classes of a project
*/
module.exports = class SourceDocumentation {


    /**
    * class constructor
    *
    * @param {string} projectRoot the to be analyzed projects 
    *                             root path
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    *
    * @returns  {object} class instance
    */
    constructor({
        projectRoot,
    } = {}) {
        if (!projectRoot) throw new InvalidArgumentException('missing parameter projectRoot containing the path to the main file of the application!');
        if (!type.string(projectRoot)) throw new InvalidArgumentException(`the option projectRoot must be a string, got '${type(projectRoot)}'!`);

        this.projectRoot = projectRoot;

        // all files that need to be analyzed for the project.
        // files may be manually added or are added using
        // the project discovery
        this.files = new Map();
    }





    /**
    * Add custom files that need to be analyzed. If the paths start
    * with the project root path passed to the constructor the project
    * root path will be removed from the files path
    *
    * @param {...string} files paths for files that need to be parsed
    *
    * @throws {InvalidArgumentException} thrown when not all required 
    *                                    parameters are set
    */
    async addFiles(...files) {
        for (const fileName of files) {
            const discovery = new SourceDiscovery();
            const resolvedFiles = await discovery.discover(fileName, false);

            for (let [file, source] of resolvedFiles.entries()) {
                if (file.startsWith(this.projectRoot)) file = file.substr(this.projectRoot.length);
                this.files.set(file, source);
            }
        }
    }





    /**
    * Add custom files that need to be analyzed. If the paths start
    * with the project root path passed to the constructor the project
    * root path will be removed from the files path. synchronous version
    *
    * @param {...string} files paths for files that need to be parsed
    *
    * @throws {InvalidArgumentException} thrown when not all required 
    *                                    parameters are set
    */
    addFilesSync(...files) {
        for (const fileName of files) {
            const discovery = new SourceDiscovery();
            const resolvedFiles = discovery.discoverSync(fileName, false);

            for (let [file, source] of resolvedFiles.entries()) {
                if (file.startsWith(this.projectRoot)) file = file.substr(this.projectRoot.length);
                this.files.set(file, source);
            }
        }
    }





    /**
    * discover all files for the project
    *
    * @param {string} fileName the path to the main file
    *                      from whoch all other files
    *                      are discovered
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    */
    async discoverSourceFiles(fileName) {
        if (!fileName) throw new InvalidArgumentException('missing parameter fileName!');
        if (!type.string(fileName)) throw new InvalidArgumentException(`the parameter fileName must be a string, got '${type(fileName)}'!`);
        
        const discovery = new SourceDiscovery();
        const files = await discovery.discover(path.join(this.projectRoot, fileName));
        
        for (let [file, source] of files.entries()) {
            if (file.startsWith(this.projectRoot)) file = file.substr(this.projectRoot.length);
            this.files.set(file, source);
        }
    }





    /**
    * discover all files for the project, synchronous version
    *
    * @param {string} fileName the path to the main file
    *                      from whoch all other files
    *                      are discovered
    *
    * @throws {InvalidArgumentException} thrown when not all 
    *                                    required parameters 
    *                                    are set
    */
    discoverSourceFilesSync(fileName) {
        if (!fileName) throw new InvalidArgumentException('missing parameter fileName!');
        if (!type.string(fileName)) throw new InvalidArgumentException(`the parameter fileName must be a string, got '${type(fileName)}'!`);
        
        const discovery = new SourceDiscovery();
        const files = discovery.discoverSync(path.join(this.projectRoot, fileName));
        
        for (let [file, source] of files.entries()) {
            if (file.startsWith(this.projectRoot)) file = file.substr(this.projectRoot.length);
            this.files.set(file, source);
        }
    }





    /**
    * analyze the source files of the project
    *
    * @returns {object} object containing the projects generated
    *                   documentation
    */
    async analyze() {
        return this.analyzeSync();
    }





    /**
    * analyze the source files of the project. synchronous version
    *
    * @returns {object} object containing the projects generated
    *                   documentation
    */
    analyzeSync() {
        const parser = new Parser();
        const classAnalyzer = new ClassAnalyzer();
        const parsedClasses = [];


        for (const [fileName, source] of this.files.entries()) {
            const ast = parser.parse(source);
            const classes = classAnalyzer.analyze(ast, this.projectRoot, fileName);

            parsedClasses.push({
                fileName,
                source,
                ast,
                classes,
            });
        }
        

        return parsedClasses;
    }
}
