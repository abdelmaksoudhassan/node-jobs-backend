const Client = require('../database/models/client.model')
const {clientAvatarUploader,
    clientCVUploader,
    deleteFile
} = require('./multer.setting')

const signUp = (request,response,next) => {
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const age = request.body.age
    const email = request.body.email
    const password = request.body.password
    const specialty = request.body.specialty

    const client = new Client({
        firstName,
        lastName,
        age,
        email,
        password,
        specialty
    })
    
    client.save().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const signIn = async (request,response,next) => {
    const email = request.body.email
    const password = request.body.password
    try{
        const client = await Client.findOne({where:{email}})
        if(! client){
            const error = new Error()
            error.message = 'this email doesn\'t exist'
            throw error
        }
        
        if(! await client.comparePassword(password)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        const token = await client.generateToken()
        response.json({client,token})
        next()
    }catch(err){
        response.status(401).json(err)
    }
}
const autoLogin = async (req,res,next) =>{
    const token = req.header('token')
    try{
        const client = await Client.findByToken(token)
        if(!client){
            const userErr = new validationError()
            userErr.message = 'this token is expired'
            throw userErr
        }
        res.json({client,token})
        next()
    }
    catch(e){
        res.status(401).json(e)
    }
}
const logOut = async (request,response,next) => {
    try{
        request.client.clearToken()
        response.json({
            loggedOut:true
        })
        next()
    }
    catch(err){
        response.status(401).json(err)
    }
}
const uploadAvatar = (request,response,next) => {
    const client = request.client
    const oldImage = client.avatar
    clientAvatarUploader(request,response,(err)=>{
        if (err) {
            return response.json(err)
        }
        if(! request.file){
            const error = new Error()
            error.message = 'file must be choosen'
            response.json(error)
        }
        client.avatar = request.file.path
        client.save().then(doc=>{
            if(oldImage){
                deleteFile(oldImage)
            }
            response.json(doc)
            next()
        }).catch(e=>{
            deleteFile(request.file.path)
            response.status(422).json(e)
        })
    })
}
const uploadCV = (request,response,next) => {
    const client = request.client
    const oldCv = client.cv

    clientCVUploader(request,response,(err)=>{
        if (err) {
            return response.status(422).json(err)
        }
        if(! request.file){
            const error = new Error()
            error.message = 'file must be choosen'
            response.status(422).json(error)
        }
        if(request.file){
            client.cv = request.file.path
        }else{
            return
        }
        client.save().then(doc=>{
            if(oldCv){
                deleteFile(oldCv)
            }
            response.json(doc)
            next()
        }).catch(e=>{
            deleteFile(request.file.path)
            response.status(422).json(e)
        })
    })
}
const updateInfo = (request,response,next) => {
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const age = request.body.age
    const specialty = request.body.specialty

    const client = request.client

    client.firstName = firstName
    client.lastName = lastName
    client.age = age
    client.specialty = specialty

    client.save().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const updateEmail = async (request,response,next) => {
    const email = request.body.email
    const password = request.body.password
    const client = request.client
    try{
        if(! await client.comparePassword(password)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        client.email = email
        const updated = await client.save()
        response.json(updated)
        next()
    }
    catch(err){
        response.status(422).json(err)
    }
}
const updatePassword = async (request,response,next) => {
    const oldPassword = request.body.old
    const newPassword = request.body.new
    
    const client = request.client
    try{
        if(! await client.comparePassword(oldPassword)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        client.password = newPassword
        await client.save()
        response.json({
            passwordUpdated:true
        })
        next()
    }
    catch(err){
        response.status(422).json(err)
    }
}

module.exports = {
    signUp,
    signIn,
    logOut,
    uploadAvatar,
    uploadCV,
    updateInfo,
    updateEmail,
    updatePassword,
    autoLogin
}