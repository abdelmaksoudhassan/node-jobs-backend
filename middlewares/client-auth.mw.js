const Client = require('../database/models/client.model')

const clientAuthMW = async (request,response,next) => {
    try{
        const token = request.header('token')
        const client = await Client.findByToken(token)
        if(! client){
            const error = new Error()
            error.message = 'this token is expired'
            throw error
        }
        request.client = client
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}

module.exports = clientAuthMW