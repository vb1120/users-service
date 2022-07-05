import { Expose } from 'class-transformer'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { InferAttributes } from 'sequelize'
import { User } from '../User'

// Dto class for validation when the user created
export class UserUpdateDto {
    @IsEmail()
    @Expose()
    email: InferAttributes<User>['email']

    @IsString()
    @MinLength(6)
    @Expose()
    password: InferAttributes<User>['password']

    @IsString()
    @Expose()
    name: InferAttributes<User>['name']
}
