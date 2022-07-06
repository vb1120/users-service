import { initConnection, sequelize } from './db'
import { startApp } from './startApp'
import './controllers'
import { MessageBroker } from './utils'

initConnection(sequelize)
    .then(() => {
        startApp()
    })
    .catch((err: Error) => console.log(err.message))

process.on('beforeExit', async () => {
    const amqp = await MessageBroker.getInstance()
    console.log('closing')
    await amqp.close()
})
