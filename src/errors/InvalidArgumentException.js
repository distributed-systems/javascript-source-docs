'use strict';


module.exports = class InvalidArgumentException extends Error {

    constructor(message) {
        super(message);
        this.name = 'InvalidArgumentException';
    }
}
