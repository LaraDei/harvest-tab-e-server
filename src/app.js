require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN} = require('./config')
const listingRouter = require('./listing/listing-router')
const createAccountRouter = require('./createAccount/createAccount-router')
const loginRouter = require('./login/login-router')
const ListingService = require('./listing/listing-service')
// const upload = require( './middleware/uploader' );

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
)
app.use(helmet())

app.use('/api/listings', listingRouter)
app.use('/api/auth', createAccountRouter)
app.use('/api/auth', loginRouter)

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
})
// app.get('/api/search', (req, res, next) => {
//     //console.log(req.query.q)
//     const term = "%" + req.query.q + "%";
//     ListingService.getByTerm(
//       req.app.get('db'),
//       term,
//     )
//       .then(listings => {
//         res.json(listings)
//       })
//       .catch(next)
//   })

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;