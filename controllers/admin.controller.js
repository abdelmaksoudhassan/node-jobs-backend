const Admin = require('../database/models/admin.model')
const {
    adminUploader,
    deleteFile
} = require('./multer.setting')

const addAdmin = (request,response,next) => {
    if(! request.admin){
        const error = new Error()
        error.message = 'unauthorized request'
        throw error
    }
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const age = request.body.age
    const email = request.body.email
    const password = request.body.password
    const admin = new Admin({
        firstName,
        lastName,
        age,
        email,
        password
    })
    admin.save().then(doc=>{
        response.json(doc)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const signIn = async (request,response,next) => {
    const email = request.body.email
    const password = request.body.password
    console.log(email)
    try{
        const admin = await Admin.findOne({where:{email}})
        if(! admin){
            const error = new Error()
            error.message = 'this email doesn\'t exist'
            throw error
            
        }
        if(! await admin.comparePassword(password)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        const token = await admin.generateToken()
        response.json({admin,token})
        next()
    }catch(err){
        response.status(422).json(err)
    }
}
const logOut = async (request,response,next) => {
    try{
        await request.admin.clearToken()
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
    const admin = request.admin
    const oldImage = admin.avatar

    adminUploader(request,response,(err)=>{
        if (err) {
            return response.status(422).json(err)
        }
        if(! request.file){
            const error = new Error()
            error.message = 'image must be choosen'
            response.status(422).json(error)
        }
        admin.avatar = request.file.path
        admin.save().then(doc=>{
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
const updateInfo = (request,response,next) => {
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const age = request.body.age

    const admin = request.admin

    admin.firstName = firstName
    admin.lastName = lastName
    admin.age = age

    admin.save().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const updateEmail = async (request,response,next) => {
    const email = request.body.email
    const password = request.body.password
    const admin = request.admin
    try{
        if(! await admin.comparePassword(password)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        admin.email = email
        const updated = await admin.save()
        response.json(updated)
        next()
    }
    catch(err){
        response.status(422).json(err)
    }
}
const updatePassword = async (request,response,next) => {
    const oldPassword = request.body.oldPassword
    const newPassword = request.body.newPassword
    const admin = request.admin
    try{
        if(! await admin.comparePassword(oldPassword)){
            const error = new Error()
            error.message = 'this password doesn\'t correct'
            throw error
        }
        admin.password = newPassword
        await admin.save()
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
    addAdmin,
    signIn,
    logOut,
    uploadAvatar,
    updateInfo,
    updateEmail,
    updatePassword
}