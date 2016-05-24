"use strict";

const co = require('co')
const Promise = require('bluebird')
const isGeneratorFunction = require('is-generator-function')

module.exports = function (func) {
    let coroutine
    
    // If it's a generator function, convert it to a Bluebird's co-routine
    if (isGeneratorFunction(func)) {
        coroutine = co.wrap(func)
    } else {
        if (typeof func !== 'function') throw new Error('Cannot map a non-function type to Express middleware')
        
        // If it's not a generator function, just ensure it will be returning a promise
        coroutine = function (req, res, next) {
            return Promise.try(() => {
                let result = func(req, res, next)
                return Promise.resolve(result)
            })
        }
    }
    
    // Wrap the asynchronous function to use the default, callback-style Express middleware and ensure Next will be called
    // passing the error if it happens
    return function (req, res, next) {
        return coroutine(req, res, next).catch(next)
    }
}
