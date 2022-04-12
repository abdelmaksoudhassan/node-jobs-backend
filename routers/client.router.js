const express = require('express')
const {
    signUp,
    signIn,
    logOut,
    uploadAvatar,
    uploadCV,
    updateInfo,
    updateEmail,
    updatePassword,
    autoLogin
} = require('../controllers/client.controller')
const authMW = require('../middlewares/client-auth.mw')
const clientRouter = express.Router()

clientRouter.post('/sign-up',signUp)
clientRouter.post('/sign-in',signIn)
clientRouter.get('/auto-log-in',autoLogin)
clientRouter.post('/log-out',authMW,logOut)
clientRouter.patch('/upload-avatar',authMW,uploadAvatar)
clientRouter.patch('/upload-CV',authMW,uploadCV)
clientRouter.patch('/update-info',authMW,updateInfo)
clientRouter.patch('/update-email',authMW,updateEmail)
clientRouter.patch('/update-password',authMW,updatePassword)

module.exports = clientRouter