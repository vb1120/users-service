import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number

    console.log(err)

    if (err.name === 'ValidationError') statusCode = 400
    else if ((err.name = 'SequelizeUniqueConstraintError')) statusCode = 409
    else statusCode = 500

    return res.status(statusCode).send({ msg: err.message })
}
