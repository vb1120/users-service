import {
    bodyValidator,
    controller,
    del,
    get,
    post,
    put,
    use
} from './decorators'
import { Request, Response } from 'express'
import { User, UserCreateDto, UserUpdateDto } from '../models'
import { authHandler } from '../middlewares'

@controller('/')
class UserController {
    @get('users')
    @use(authHandler())
    async getUsers(req: Request, res: Response) {
        const users = await User.findAll()
        res.status(200).json({ users })
    }

    @post('users')
    @use(authHandler())
    @bodyValidator(UserCreateDto)
    async createUser(req: Request, res: Response) {
        const { email } = req.body

        const user = await User.findOne({ where: { email } })
        if (user)
            return res
                .status(400)
                .send({ msg: `User with email ${email} already exists` })

        const newUser = await User.create(req.body)

        res.status(201).json({ user: newUser })
    }

    @get('users/:userUuid')
    @use(authHandler())
    async getUserByUuid(req: Request, res: Response) {
        const { userUuid } = req.params

        const user = await User.findByPk(userUuid)
        if (!user)
            return res
                .status(404)
                .send({ msg: `User with uuid ${userUuid} not found` })

        res.status(200).json({ user })
    }

    @put('users/:userUuid')
    @use(authHandler())
    @bodyValidator(UserUpdateDto)
    async updateUserByUuid(req: Request, res: Response) {
        const { userUuid } = req.params

        let user = await User.findByPk(userUuid)
        if (!user)
            return res
                .status(404)
                .send({ msg: `User with uuid ${userUuid} not found` })

        user = await user.update(req.body)

        res.status(200).json({ user })
    }

    @del('users/:userUuid')
    @use(authHandler())
    async deleteUserByUuid(req: Request, res: Response) {
        const { userUuid } = req.params

        let user = await User.findByPk(userUuid)
        if (!user)
            return res
                .status(404)
                .send({ msg: `User with uuid ${userUuid} not found` })

        await user.destroy()

        res.status(204).end()
    }
}
