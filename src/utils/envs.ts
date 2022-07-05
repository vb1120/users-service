import 'dotenv/config'

interface Env {
    nodeEnv: string
    port: number
    postgresUri: string
}

export const envs: Env = {
    nodeEnv: <string>process.env.NODE_ENV,
    port: parseInt(<string>process.env.PORT),
    postgresUri: <string>process.env.POSTGRES_URI
}
