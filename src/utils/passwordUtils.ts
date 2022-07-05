import * as bcrypt from 'bcrypt'
import { envs } from './envs'

const { saltRounds } = envs

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds)
}

export const comparePasswords = async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed)
}
