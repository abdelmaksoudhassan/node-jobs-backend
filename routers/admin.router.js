const express = require('express')
const {
    addAdmin,
    signIn,logOut,
    uploadAvatar,
    updateInfo,
    updateEmail,
    updatePassword
} = require('../controllers/admin.controller')
const authMW = require('../middlewares/admin-auth.mw')
const adminRouter = express.Router()

adminRouter.post('/add-admin',authMW,addAdmin)
adminRouter.post('/sign-in',signIn)
adminRouter.post('/log-out',authMW,logOut)
adminRouter.patch('/upload-avatar',authMW,uploadAvatar)
adminRouter.patch('/update-info',authMW,updateInfo)
adminRouter.patch('/update-email',authMW,updateEmail)
adminRouter.patch('/update-password',authMW,updatePassword)

module.exports = adminRouter