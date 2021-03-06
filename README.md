[![Build Status](https://travis-ci.org/danp3d/express_cowrap.svg?branch=master)](https://travis-ci.org/danp3d/express_cowrap)
[![Code Climate](https://codeclimate.com/github/danp3d/express_cowrap/badges/gpa.svg)](https://codeclimate.com/github/danp3d/express_cowrap)
[![Issue Count](https://codeclimate.com/github/danp3d/express_cowrap/badges/issue_count.svg)](https://codeclimate.com/github/danp3d/express_cowrap)
[![Test Coverage](https://codeclimate.com/github/danp3d/express_cowrap/badges/coverage.svg)](https://codeclimate.com/github/danp3d/express_cowrap/coverage)

# express_cowrap

Wraps Express middleware functions so you can use proper error handling for applications depending heavily on Promises.
Examples: 

```javascript

const Promise = require('bluebird')
const coWrap = require('express_cowrap')
const express = require('express')

let app = express()

// Promise-returing function
app.get('/promise', coWrap(function (req, res) {
    return Promise.reject('error message')
})

// Regular, synchronous function
app.get('/sync', coWrap(function (req, res) {
    throw new Error('error message')
}))

// Generator function (with yield)
app.get('/generators', coWrap(function* (req, res) {
    let data = yield database.query() // promise-returning function
    yield Promise.delay(20)
    
    throw new Error('error message')
    
    // Won't execute this
    res.status(200).send({ message: "You won't see me!" })
}))

// Error handler
app.use(function errorHandler(err, req, res, next) {
    console.log('[Error happened]', err)
    
    res.status(500).send({ error: (err.message || err) })
})

```
