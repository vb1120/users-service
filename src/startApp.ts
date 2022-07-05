import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { errorHandler } from './middlewares'
import { AppRouter, envs } from './utils'

const { port } = envs

export const startApp = () => {
    const app = express()

    app.use(cors())
    app.use(bodyParser.json())
    app.use(morgan('combined'))

    app.use(AppRouter.getInstance())

    app.use(errorHandler)

    app.listen(port, '0.0.0.0', () => {
        console.info(`Users Service listening on port ${port}`)
    })
}
