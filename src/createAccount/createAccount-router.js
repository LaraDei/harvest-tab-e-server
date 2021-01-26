const path = require('path')
const express = require('express')
const CreateAccountService = require('./createAccount-service')
const createAccountRouter = express.Router()
const jsonParser = express.json()

createAccountRouter
  .post('/register', jsonParser, (req, res, next) => {
    const { password, email, full_name } = req.body

    for (const field of ['full_name', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })


    const passwordError = CreateAccountService.validatePassword(password)
    const emailError = CreateAccountService.validateEmail(email)

    if (passwordError)
      return res.status(400).json({ error: passwordError })
    if (emailError)
      return res.status(400).json({ error: emailError })

      CreateAccountService.hasUserWithEmail(
      req.app.get('db'),
      email
    )
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({ error: `Email already taken` })

        return CreateAccountService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              email,
              password: hashedPassword,
              full_name,
              date_created: 'now()',
            }

            return CreateAccountService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(CreateAccountService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = createAccountRouter;