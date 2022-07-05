import { bodyValidator, controller, del, get, post, put } from './decorators'
import { Request, Response } from 'express'
import { User, UserCreateDto, UserUpdateDto } from '../models'

@controller('/')
class UserController {
    @get('users')
    async getUsers(req: Request, res: Response) {
        const users = await User.findAll()
        res.status(200).json({ users })
    }

    @post('users')
    @bodyValidator(UserCreateDto)
    async createUser(req: Request, res: Response) {
        const user = await User.create(req.body)
        res.status(201).json({ user })
    }

    @get('users/:userUuid')
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
