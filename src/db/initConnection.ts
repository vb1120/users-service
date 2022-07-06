import { Sequelize } from 'sequelize'

// Connects and syncs the models
export const initConnection = async (sequelize: Sequelize) => {
    await sequelize.authenticate()
    console.log('Database connection established successfully')
    await sequelize.sync({ alter: true })
    console.log('Models synchronized successfully')
}
