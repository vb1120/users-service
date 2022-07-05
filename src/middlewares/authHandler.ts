import { Request, Response, NextFunction } from 'express'
import { IJwtPayload, JwtUtils } from '../utils/JwtUtils'

export enum Tokens {
    accessToken = 'accessToken',
    refreshToken = 'refreshToken'
}

export const authHandler = (tokenType: string = Tokens.accessToken) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization

        if (authHeader) {
            const token = authHeader.split('')[1]
            try {
                let jwtPayload: IJwtPayload

                switch (tokenType) {
                    case Tokens.accessToken:
                    default:
                        jwtPayload = JwtUtils.verifyAccessToken(token)
                        break
                    case Tokens.refreshToken:
                        jwtPayload = JwtUtils.verifyRefreshToken(token)
                        break
                }

                req.payload = jwtPayload

                next()
            } catch (error) {
                return res.status(401).send({ msg: 'Invalid token' })
            }
        } else {
            return res
                .status(401)
                .send({ msg: 'Authorization header not found' })
        }
    }
}
