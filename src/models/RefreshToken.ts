import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    ForeignKey
} from 'sequelize'
import { sequelize } from '../db'
import { User } from './User'

// order of InferAttributes & InferCreationAttributes is important.
export class RefreshToken extends Model<
    InferAttributes<RefreshToken>,
    InferCreationAttributes<RefreshToken>
> {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>
    declare token: string | null
    declare userUuid: ForeignKey<User['uuid']>
}

// Model initialization
RefreshToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING
        },
        userUuid: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'uuid'
            }
        }
    },
    {
        sequelize,
        timestamps: true,
        updatedAt: false,
        tableName: 'tokens'
    }
)

User.hasOne(RefreshToken, { foreignKey: 'userUuid', sourceKey: 'uuid' })
RefreshToken.belongsTo(User, { foreignKey: 'userUuid', targetKey: 'uuid' })
