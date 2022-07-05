import jwt from 'jsonwebtoken'
import { envs } from './envs'

export interface IJwtPayload {
    uuid: string
    email: string
}

export class JwtUtils {
    private static accessSecret = envs.jwtAccess
    private static refreshSecret = envs.jwtRefresh
    private static accessOption = envs.accessExpire
    private static refreshOption = envs.refreshExpire

    static generateAccessToken(payload: IJwtPayload): string {
        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessOption
        })
    }

    static generateRefreshToken(payload: IJwtPayload) {
        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshOption
        })
    }

    static verifyAccessToken(accessToken: string) {
        return jwt.verify(accessToken, this.accessSecret) as IJwtPayload
    }

    static verifyRefreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, this.refreshSecret) as IJwtPayload
    }
}
