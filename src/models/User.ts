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
import { MessageBroker } from '../utils'
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
    declare name?: CreationOptional<string>

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
        const refreshToken = JwtUtils.generateRefreshToken(jwtPayload)

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

// Hash passsword before create
User.beforeCreate(async (user, options) => {
    user.password = await hashPassword(user.password)
})

// Hash passsword before update if password changed
User.beforeUpdate(async (user, options) => {
    user.password = await hashPassword(user.password)
})

/*  
    When user after create hook is triggered it sends 
    the user email to mailing service through message broker
 */
User.afterCreate(async (user, options) => {
    const messageBroker = await MessageBroker.getInstance()

    const jsonToSend: { [key: string]: string } = {
        email: user.email
    }

    if (user.name) jsonToSend['name'] = user.name

    await messageBroker.send('mailing', Buffer.from(JSON.stringify(jsonToSend)))

    await messageBroker.close()
})
