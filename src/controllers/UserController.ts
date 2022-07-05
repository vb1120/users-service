import { controller, del, get, post, put } from './decorators'
import { Request, Response } from 'express'

@controller('/')
class UserController {
    @get('users')
    async getUsers(req: Request, res: Response) {}

    @post('users')
    async createUser(req: Request, res: Response) {}

    @get('users/:userUuid')
    async getUserByUuid(req: Request, res: Response) {}

    @put('users/:userUuid')
    async updateUserByUuid(req: Request, res: Response) {}

    @del('users/:userUuid')
    async deleteUserByUuid(req: Request, res: Response) {}
}
