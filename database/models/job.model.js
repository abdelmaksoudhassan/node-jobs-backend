const sequelize = require('../connection')
const Sequelize = require('sequelize')

const Job = sequelize.define('job',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    about:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
    },
    careerLevel:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    experience:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    gender:{
        type: Sequelize.ENUM('male or female','male', 'female'),
        allowNull: false,
    },
    jobName:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    jobRequirements:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('jobRequirements').split(';')
        },
        set(val) {
            this.setDataValue('jobRequirements',val.join(';'));
        }
    },
    jobType:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    position:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    salary:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    approved:{
        type:Sequelize.DataTypes.BOOLEAN,
        defaultValue:false
    }
})
module.exports = Job