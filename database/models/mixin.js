const Sequelize = require('sequelize')

const props = {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName:{
        type:Sequelize.STRING,
        allowNull: false,
        validate:{
            isAlpha:{
                msg: 'this field supports only letters'
            },
            len: {
                args: [3,10],
                msg: 'this field must be 3-10 letters'
            }
        }
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull: false,
        validate:{
            isAlpha:{
                msg: 'this field supports only letters'
            },
            len: {
                args: [3,10],
                msg: 'this field must be 3-10 letters'
            }
        }
    },
    fullName: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value !');
        }
    },
    age:{
        type: Sequelize.INTEGER,
        validate:{
            max: {
                args:[60],
                msg:'max age is 60'
            },
            min: {
                args:[20],
                msg:'min age is 20'
            }
        }
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail:{
                msg:'invalid email format'
            }
        }
    },
    password:{
        type:Sequelize.DataTypes.TEXT,
        allowNull:false,
        validate:{
            notNull:{
                msg: 'this field can\'t be null'
            }
        }
    },
    token:{
        type:Sequelize.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    avatar:{
        type:Sequelize.STRING
    }
}

module.exports = {
    props
}