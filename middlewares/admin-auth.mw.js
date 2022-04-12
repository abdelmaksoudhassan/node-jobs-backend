const Admin = require('../database/models/admin.model')

const adminAuthMW = async (request,response,next) => {
    try{
        const token = request.header('token')
        const admin = await Admin.findByToken(token)
        if(! admin){
            const error = new Error()
            error.message = 'this token is expired'
            throw error
        }
        request.admin = admin
        next()
    }
    catch(err){
        console.log(err)
        response.status(403).json(err)
    }
}

module.exports = adminAuthMW