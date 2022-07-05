import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin,
    HasOneSetAssociationMixin,
    DataTypes
} from 'sequelize'
import { sequelize } from '../db'
import { IJwtPayload, JwtUtils } from '../utils/JwtUtils'
import { hashPassword } from '../utils/passwordUtils'
import { RefreshToken } from './RefreshToken'

// order of InferAttributes & InferCreationAttributes is important.
export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare uuid: CreationOptional<string>
    declare email: string
    declare password: string
    declare name: CreationOptional<string>

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    declare getRefreshToken: HasOneGetAssociationMixin<RefreshToken>
    declare setRefreshToken: HasOneSetAssociationMixin<RefreshToken, number>
    declare createRefreshToken: HasOneCreateAssociationMixin<RefreshToken>

    // custom instance method
    assignTokensToUserAndReturnThem(): { [key: string]: string } {
        const jwtPayload: IJwtPayload = {
            uuid: this.uuid,
            email: this.email
        }

        const accessToken = JwtUtils.generateAccessToken(jwtPayload)
        const refreshToken = JwtUtils.generateAccessToken(jwtPayload)

        return { accessToken, refreshToken }
    }
}

// Model initialization
User.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        timestamps: true,
        tableName: 'users'
    }
)

// Hooks
User.beforeCreate(async (user, options) => {
    user.password = await hashPassword(user.password)
})
