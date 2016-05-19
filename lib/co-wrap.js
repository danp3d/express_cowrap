"use strict";

const Promise = require('bluebird')
const isGeneratorFunction = require('is-generator-function')

module.exports = function (func) {
    let co
    
    // If it's a generator function, convert it to a Bluebird's co-routine
    if (isGeneratorFunction(func)) {
        co = Promise.coroutine(func)
    } else {
        if (typeof func !== 'function') throw new Error('Cannot map a non-function type to Express middleware')
        
        // If it's not a generator function, just ensure it will be returning a promise
        co = function (req, res, next) {
            return Promise.try(() => {
                let result = func(req, res, next)
                return Promise.resolve(result)
            })
        }
    }
    
    // Wrap the asynchronous function to use the default, callback-style Express middleware and ensure Next will be called
    // passing the error if it happens
    return function (req, res, next) {
        return co(req, res, next).catch(next)
    }
}