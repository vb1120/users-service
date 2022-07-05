import { initConnection, sequelize } from './db'
import { startApp } from './startApp'
import './controllers'

initConnection(sequelize)
    .then(() => {
        startApp()
    })
    .catch((err: Error) => console.log(err.message))
