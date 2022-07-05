import { initConnection, sequelize } from './db'
import { startApp } from './startApp'

initConnection(sequelize)
    .then(() => {
        startApp()
    })
    .catch((err: Error) => console.log(err.message))
