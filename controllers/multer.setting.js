const multer = require('multer')
const fs = require('fs')
const path = require('path')

var adminStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/uploads/admins')
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname + '-' + Date.now()).replace(/ /g,""))
    }
})

var clientCVStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/uploads/clients/CVs')
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname + '-' + Date.now()).replace(/ /g,""))
    }
})

var clientAvatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/uploads/clients/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname + '-' + Date.now()).replace(/ /g,""))
    }
})

const imageFileFilter = (req,file,cb)=>{
    const extension = path.extname(file.originalname)
    if((extension == '.png')||(extension == '.jpg')||(extension === '.jpeg')){
        cb(null,true)
    }else{
        cb(new Error('file must be image'),false)
    }
}

const CVFileFilter = (req,file,cb)=>{
    const extension = path.extname(file.originalname)
    if(extension == '.pdf'){
        cb(null,true)
    }else{
        cb(new Error('file must be pdf'),false)
    }
}

const fileSize = {fileSize : 512*1024} //512 kb

const clientAvatarUploader = multer({
    storage:clientAvatarStorage,
    fileFilter:imageFileFilter,
    limits:fileSize
}).single('image')

const clientCVUploader = multer({
    storage:clientCVStorage,
    fileFilter:CVFileFilter,
    limits:fileSize
}).single('cv')

const adminUploader = multer({
    storage:adminStorage,
    fileFilter:imageFileFilter,
    limits:fileSize
}).single('image')

const deleteFile = (path) =>{
    if(!! path){
        fs.unlink(path,()=>{
            console.log('file deleted')
        })
    }
}

module.exports = {
    deleteFile,
    adminUploader,
    clientCVUploader,
    clientAvatarUploader
}