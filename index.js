// import dotenv first
import dotenv from 'dotenv/config'
import express from 'express'
import execa from 'execa'
import fs from 'fs'

import { GitHub } from './serviceProviders'

// Initialize express
const app = express()

// get/set defaults from .env
const { APP_PORT = 8080 } = process.env

// api endpoint
app.post('/:user/:project', (req, res) => {
  if (!!req.get('X-Github-Event')) {
    GitHub({ event: req.get('X-Github-Event'), params: req.params })
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

app.listen(APP_PORT, () =>
  console.log(`WebPloy is listening on port ${APP_PORT}!`),
)
