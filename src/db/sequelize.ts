import { Sequelize } from 'sequelize'
import { envs } from '../utils'

const { postgresUri } = envs

export const sequelize = new Sequelize(postgresUri, {
    logging: console.log
})
