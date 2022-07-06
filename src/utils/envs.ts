import 'dotenv/config'

interface Env {
    nodeEnv: string
    port: number
    postgresUri: string
    saltRounds: number
    jwtAccess: string
    jwtRefresh: string
    accessExpire: string
    refreshExpire: string
    rabbitmqUri: string
}

export const envs: Env = {
    nodeEnv: <string>process.env.NODE_ENV,
    port: parseInt(<string>process.env.PORT),
    postgresUri: <string>process.env.POSTGRES_URI,
    saltRounds: parseInt(<string>process.env.SALT_ROUNDS),
    jwtAccess: <string>process.env.JWT_ACCESS,
    jwtRefresh: <string>process.env.JWT_REFRESH,
    accessExpire: <string>process.env.ACCESS_EXPIRE,
    refreshExpire: <string>process.env.REFRESH_EXPIRE,
    rabbitmqUri: <string>process.env.RABBITMQ_URI
}
