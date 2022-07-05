import { Request, Response } from 'express'
import { User } from '../models'
import { post } from './decorators'
import { controller } from './decorators/controller'

@controller('/')
class AuthController {
    @post('signup')
    async signup(req: Request, res: Response) {
        const { email, password } = req.body

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
