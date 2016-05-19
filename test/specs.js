"use strict";

const Promise = require('bluebird')
const should = require('should')
const coWrap = require('../')

describe('CoWrap', () => {
    it('Should wrap generator function', (done) => {
        let co = coWrap(function* () {
            yield Promise.delay(20)
            done()
        })
        
        co()
    })
    
    it('Should handle errors', (done) => {
        const errorMessage = "I'm an error!"
        let next = (err) => {
            err.should.be.ok()
            err.message.should.equal(errorMessage)
            
            done()
        }
        
        let co = coWrap(function* () {
            yield Promise.delay(20)
            throw new Error(errorMessage)
        })
        
        co(null, null, next)
    })
    
    it('Should wrap promise-returning regular function', (done) => {
        let cb = (err) => done('Ooops :(. Called next')
        
        let func = coWrap(() => {
            return Promise.resolve('worked')
        })
        
        func(null, null, cb).then((result) => {
            result.should.equal('worked')
            done()
        })
    })
    
    it('Should handle promise rejection', (done) => {
        let func = coWrap(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => reject('error'), 20)
            })
        })
        
        func(null, null, (err) => {
            err.should.equal('error')
            done()
        })
    })
    
    it('Should wrap synchronous function', (done) => {
        let func = coWrap(() => {
            return 'worked'
        })
        
        func(null, null, null).then((result) => {
            result.should.equal('worked')
            done()
        })
    })
    
    it('Should handle synchronous error', (done) => {
        const errorMessage = "I'm an error message!"
        
        let func = coWrap(() => {
            throw new Error(errorMessage)
        })
        
        func(null, null, (err) => {
            err.message.should.be.equal(errorMessage)
            done()
        })
    })
    
    it('Should throw error for non-function types', (done) => {
        try {
            let func = coWrap(null)
        } catch(err) {
            err.should.be.ok()
            return done()
        }
        
        return done('Did not throw error!')
    })
})