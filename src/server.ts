import { sequelize } from './db'
import { startApp } from './startApp'

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection established successfully')
        startApp()
    })
    .catch((err: Error) => console.log(err.message))
