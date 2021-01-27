const express = require('express')
const loginService = require('./login-service')
const { requireAuth } = require('../middleware/jwt-auth')
const loginRouter = express.Router()
const jsonParser = express.json()

loginRouter
  .post('/login', jsonParser, (req, res, next) => {
    const { email, password } = req.body
    const loginUser = { email, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

      loginService.getUserWithEmail(
      req.app.get('db'),
      loginUser.email
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect email or password',
          })

        return loginService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect email or password',
              })

            const sub = dbUser.email
            const payload = { user_id: dbUser.id }
            res
            .location(path.posix.join(req.originalUrl, `/${dbUser.id}`))
            .send({
              authToken: loginService.createJwt(sub, payload),
            })
          })
      })
      .catch(next)
  })

  // loginRouter.post('/refresh', requireAuth, (req, res) => {
  //   const sub = req.user.email
  //   const payload = { user_id: req.user.id }
  //   res.send({
  //     authToken: loginService.createJwt(sub, payload),
  //   })
  // })

module.exports = loginRouter