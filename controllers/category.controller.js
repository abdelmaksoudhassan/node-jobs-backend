const category = require('../database/models/category.model')

const getCategories= async (request,response,next) => {
    try{
        const categories = await category.findAll()
        response.json({categories})
    }catch(err){
        response.status(500).json(err)
    }
}
const postCategory = (request,response,next) =>{
    const title = request.body.title
    const cat = new category({title})
    cat.save().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const editCategory = async (request,response,next) => {
    const id = request.params.id
    try{
        const cat = await category.findByPk(id)
        if(!cat){
            const error = new Error()
            error.message = "category not found"
            throw error
        }
        cat.title = request.body.title
        const edited = await cat.save()
        response.json(edited)
        next()
    }
    catch(err){
        response.status(422).json(err)
    }
}
const deleteCategory = async (request,response,next) => {
    const id = request.params.id
    try{
        const cat = await category.findByPk(id)
        if(!cat){
            const error = new Error()
            error.message = "category not found"
            throw error
        }
        await cat.destroy()
        response.json({
            deleted:true
        })
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}
module.exports = {
    postCategory,
    editCategory,
    deleteCategory,
    getCategories
}