const sequelize = require('../connection')
const Sequelize = require('sequelize')
const {genSalt,hash,compare} = require('bcryptjs')
const {sign,verify} = require('jsonwebtoken')
const {props} = require('./mixin')

const Client = sequelize.define('client',{
    ...props,
    specialty:{
        type:Sequelize.STRING,
        allowNull: false,
        len: {
            args: [3,10],
            msg: 'this field must be 3-10 letters'
        }
    },
    cv:{
        type:Sequelize.STRING
    }
})
Client.prototype.toJSON =  function () {
    var client = Object.assign({}, this.get());
    delete client.password;
    delete client.token;
    return client;
}
Client.prototype.generateToken = async function(){
    this.token = await sign({id:this.id},process.env.SECRET_KEY)
    await this.save()
    return this.token
}
Client.prototype.clearToken = async function(){
    this.token = null
    await this.save()
}
Client.prototype.comparePassword = async function(password){
    return compare(password,this.password)
}
Client.findByToken = async function(token){
    try{
        const {id} = await verify(token,process.env.SECRET_KEY)
        const client = await this.findOne({where:{id}})
        return Promise.resolve(client)
    }catch{
        const error = new Error()
        error.message = 'invalid token'
        return Promise.reject(error)
    }
}
Client.beforeCreate(async (client, options) => {
    const salt  = await genSalt(5)
    const hashed = await hash(client.password,salt)
    client.password = hashed;
});
Client.beforeUpdate(async (client, options) => {
    if(client.dataValues.password !== client._previousDataValues.password){
        const salt  = await genSalt(5)
        const hashed = await hash(client.password,salt)
        client.password = hashed;
    }
});
module.exports = Client