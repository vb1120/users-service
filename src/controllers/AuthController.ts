import { Request, Response } from 'express'
import { User, UserCreateDto } from '../models'
import { bodyValidator, controller, post } from './decorators'

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
    async login(req: Request, res: Response) {}
    async token(req: Request, res: Response) {}
    async logout(req: Request, res: Response) {}
}
