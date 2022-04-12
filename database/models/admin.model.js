const sequelize = require('../connection')
const {props} = require('./mixin')
const {
    genSalt,
    hash,
    compare
} = require('bcryptjs')
const {
    sign,
    verify
} = require('jsonwebtoken')

const Admin = sequelize.define('admin',props)
Admin.prototype.toJSON =  function () {
    var admin = Object.assign({}, this.get());
    delete admin.password;
    delete admin.token;
    return admin;
}
Admin.prototype.generateToken = async function(){
    this.token = await sign({id:this.id},process.env.SECRET_KEY)
    await this.save()
    return this.token
}
Admin.prototype.clearToken = async function(){
    this.token = null
    await this.save()
}
Admin.prototype.comparePassword = async function(password){
    return compare(password,this.password)
}
Admin.findByToken = async function(token){
    try{
        const {id} = await verify(token,process.env.SECRET_KEY)
        const admin = await this.findOne({where:{id}})
        return Promise.resolve(admin)
    }catch{
        const error = new Error()
        error.message = 'invalid token'
        return Promise.reject(error)
    }
}
Admin.beforeCreate(async (admin, options) => {
    const salt  = await genSalt(5)
    const hashed = await hash(admin.password,salt)
    admin.password = hashed;
});
Admin.beforeUpdate(async (admin, options) => {
    if(admin.dataValues.password !== admin._previousDataValues.password){
        const salt  = await genSalt(5)
        const hashed = await hash(admin.password,salt)
        admin.password = hashed;
    }
});
module.exports = Admin