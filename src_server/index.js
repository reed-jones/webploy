// import dotenv first
import dotenv from 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import models from './models'
import jwt from 'jsonwebtoken'
import path from 'path'

// const renderer = createBundleRenderer()

import { GitHub } from './serviceProviders'

import schema from './data/schema'

// get/set defaults from .env
const { APP_PORT = 8080, JWT_SECRET } = process.env
// Initialize express
const app = express()

const addUser = async req => {
  // remove 'Bearer '
  const token = req.headers.authorization.split(' ')[1]

  if (token) {
    try {
      const { user } = await jwt.verify(token, JWT_SECRET)
      req.user = user
    } catch (err) {
      console.log(err)
    }
  } else {
    req.user = null
  }
  req.next()
}
app.use('/graphql', addUser)

// api endpoint
// app.post('/:user/:project', (req, res) => {
//   if (!!req.get('X-Github-Event')) {
//     GitHub({ event: req.get('X-Github-Event'), params: req.params })
//     res.sendStatus(200)
//   } else {
//     res.sendStatus(404)
//   }
// })
app.use('/hooks/:serviceProvider', bodyParser.json())
app.post('/hooks/:serviceProvider', (req, res) => {
  console.log()
  switch (req.params.serviceProvider) {
    case 'github':
      GitHub(req, res)
      break
    default:
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
app.use(express.static(path.join(__dirname, '../dist')))

models.sequelize.sync().then(_ => {
  app.listen(APP_PORT, () =>
    console.log(`WebPloy is listening on port ${APP_PORT}!`),
  )
})
