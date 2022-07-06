import { Request, Response } from 'express'
import { authHandler, Tokens } from '../middlewares'
import { User, UserCreateDto } from '../models'
import { comparePasswords } from '../utils'
import { IJwtPayload, JwtUtils } from '../utils/JwtUtils'
import { bodyValidator, controller, post, use } from './decorators'

@controller('/')
class AuthController {
    @post('signup')
    @bodyValidator(UserCreateDto)
    async signup(req: Request, res: Response) {
        const { email } = req.body

        const user = await User.findOne({ where: { email } })
        if (user)
            return res
                .status(400)
                .send({ msg: `User with email '${email}' already exists` })

        const newUser = await User.create(req.body)

        const { accessToken, refreshToken } =
            newUser.assignTokensToUserAndReturnThem()

        await newUser.createRefreshToken({ token: refreshToken })

        return res.status(201).send({ accessToken, refreshToken })
    }

    @post('login')
    @bodyValidator(UserCreateDto)
    async login(req: Request, res: Response) {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })
        if (!user || !comparePasswords(password, user.password))
            return res.status(401).send({ msg: `Invalid Credentials` })

        const jwtPayload: IJwtPayload = { uuid: user.uuid, email }
        const accessToken = JwtUtils.generateAccessToken(jwtPayload)
        const savedRefreshToken = await user.getRefreshToken()

        let refreshToken: string

        if (!savedRefreshToken || !savedRefreshToken.token) {
            refreshToken = JwtUtils.generateRefreshToken(jwtPayload)

            if (!savedRefreshToken) {
                await user.createRefreshToken({ token: refreshToken })
            } else {
                savedRefreshToken.token = refreshToken
                await savedRefreshToken.save()
            }
        } else {
            refreshToken = savedRefreshToken.token
        }

        return res.status(200).send({ accessToken, refreshToken })
    }

    @post('token')
    @use(authHandler(Tokens.refreshToken))
    async token(req: Request, res: Response) {
        const { uuid, email } = req.payload

        const user = await User.findOne({ where: { email } })

        if (!user)
            return res.status(404).send({
                msg: `User with email ${email} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        if (!refreshToken || !refreshToken.token)
            return res.status(401).send({ msg: 'Unauthorized' })

        const accessToken = JwtUtils.generateAccessToken({
            uuid,
            email
        })

        return res.status(200).send({ accessToken })
    }

    @post('logout')
    @use(authHandler())
    async logout(req: Request, res: Response) {
        const { email } = req.payload

        const user = await User.findOne({
            where: { email }
        })

        if (!user)
            return res.status(404).send({
                msg: `User with email ${email} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        refreshToken.token = null
        await refreshToken.save()

        return res.status(200).send({ msg: 'Successfully logged out' })
    }
}
