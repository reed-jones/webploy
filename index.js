// import dotenv first
import dotenv from 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import models from './models'
import jwt from 'jsonwebtoken'

import { GitHub } from './serviceProviders'

import schema from './data/schema'

// get/set defaults from .env
const { APP_PORT = 8080, JWT_SECRET } = process.env
// Initialize express
const app = express()

const addUser = async req => {
  const token = req.headers['authorization']

  try {
    const { user } = await jwt.verify(token, JWT_SECRET)
    req.user = user
  } catch (err) {
    console.log(err)
  }
  req.next()
}
app.use(addUser)

// api endpoint
app.post('/:user/:project', (req, res) => {
  if (!!req.get('X-Github-Event')) {
    GitHub({ event: req.get('X-Github-Event'), params: req.params })
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
)

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      secret: JWT_SECRET,
      user: req.user,
    },
  })),
)

models.sequelize.sync().then(_ => {
  app.listen(APP_PORT, () =>
    console.log(`WebPloy is listening on port ${APP_PORT}!`),
  )
})
