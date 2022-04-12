const express = require('express')
const categoryRouter = express.Router()
const {
    postCategory,
    editCategory,
    deleteCategory,
    getCategories
} = require('../controllers/category.controller')
const adminAuth = require('../middlewares/admin-auth.mw')

categoryRouter.post('/post-category',adminAuth,postCategory)
categoryRouter.patch('/edit-category/:id',adminAuth,editCategory)
categoryRouter.delete('/delete-category/:id',adminAuth,deleteCategory)
categoryRouter.get('/get-categories',getCategories)

module.exports = categoryRouter