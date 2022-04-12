const Job = require('../database/models/job.model')
const Client = require('../database/models/client.model')
const Category = require('../database/models/category.model')

const postJob = (request,response,next) =>{
    const about = request.body.about
    const careerLevel = request.body.careerLevel
    const experience = request.body.experience
    const gender = request.body.gender
    const jobName = request.body.jobName
    const jobRequirements = request.body.jobRequirements
    const jobType = request.body.jobType
    const position = request.body.position
    const salary = request.body.salary
    const categoryId = request.body.categoryId
    const client = request.client
    client.createJob({
        about,
        careerLevel,
        experience,
        gender,
        jobName,
        jobRequirements,
        jobType,
        position,
        salary,
        categoryId
    }).then(res=>{
        response.status(201).json(res)
        next()
    }).catch(err=>{
        response.status(422).json(err)
    })
}
const editJob = async (request,response,next) => {
    const client = request.client
    const id = request.params.id
    
    try{
        const job = await Job.findByPk(id)
        if(job.clientId !== client.id){
            const error = new Error()
            error.message = 'unauthorized request'
            throw error
        }
        job.about = request.body.about
        job.careerLevel = request.body.careerLevel
        job.categoryId = request.body.categoryId
        job.experience = request.body.experience
        job.gender = request.body.gender
        job.jobName = request.body.jobName
        job.jobRequirements = request.body.jobRequirements
        job.jobType = request.body.jobType
        job.position = request.body.position
        job.salary = request.body.salary

        const edited = await job.save()
        response.json(edited)
        next()
    }
    catch(err){
        response.status(422).json(err)
    }
}
const deleteJob = async (request,response,next) => {
    const client = request.client
    const id = request.params.id
    try{
        const job = await Job.findByPk(id)
        if(job.clientId !== client.id){
            const error = new Error()
            error.message = 'unauthorized request'
            throw error
        }
        await job.destroy()
        response.json({
            deleted:true
        })
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}
const getJob = async (request,response,next) => {
    const id = request.params.id
    try{
        const _job = await Job.findByPk(id,{
            include:[Client,Category],
            attributes:{
                exclude:['clientId','categoryId','cv']
            }
        })
        if(!_job){
            const error = new Error()
            error.message = 'job not found'
            throw error
        }
        const appliersCount = await _job.countClients()
        var job = _job.toJSON()
        delete job.client.id
        delete job.client.password
        delete job.client.token
        delete job.client.updatedAt
        response.json({...job,appliersCount})
        next()
    }
    catch(err){
        response.status(404).json(err)
    }
}
const getJobs= (request,response,next) => {
    const page = +request.query.page
    const limit = +request.query.count
    Job.findAndCountAll({where:{approved:true},limit,offset:(page-1)*limit}).then(jobs=>{
        response.json({
            jobs:jobs.rows,
            currentPage:page,
            hasNextPage: limit*page<jobs.count,
            hasPreviousPage: page>1,
            nextPage: ((jobs.count/(limit*page) >1) ? page+1 : null),
            previousPage: (page>1 ? page-1 : null ),
            lastPage:Math.ceil(jobs.count/limit),
            total:jobs.count,
            pagesNum: Math.round(jobs.count/limit)
        })
        next()
    }).catch(err=>{
        response.status(505).json(err)
    })
}
const getMyJobs = (request,response,next) =>{
    const client = request.client
    client.getJobs().then(res=>{
        response.json(res)
        next()
    }).catch(err=>{
        response.status(505).json(err)
    })
}
const acceptJob = async (request,response,next) => {
    const admin = request.admin
    const id = request.params.id
    try{
        if(! admin){
            const error = new Error()
            error.message = "unauthorized request"
            throw error
        }
        const job = await Job.findByPk(id)
        job.approved = true
        await job.save()
        response.json({
            accepted:true
        })
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}
const rejectJob = async (request,response,next) => {
    const admin = request.admin
    const id = request.params.id
    try{
        if(! admin){
            const error = new Error()
            error.message = "unauthorized request"
            throw error
        }
        const job = await Job.findOne({where:{id,approved:false}})
        await job.destroy()
        response.json({
            rejected:true
        })
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}
const applyJob = async (request,response,next) => {
    const client = request.client
    const id = request.params.id
    try{
        if(! client){
            const error = new Error()
            error.message = "unauthorized request"
            throw error
        }
        const job = await Job.findByPk(id)
        const appliers = await job.getClients()
        if(appliers.filter(x=>x.id == client.id).length){
            const error = new Error()
            error.message = "already applied"
            throw error
        }
        await job.addClient(client.id)
        response.json({
            applied:true
        })
        next()
    }
    catch(err){
        response.status(403).json(err)
    }
}
const getAppliers = async (request,response,next) => {
    const id = request.params.id
    try{
        const job = await Job.findByPk(id)
        const appliers = await job.getClients()
        response.json(appliers)
        next()
    }
    catch(err){
        response.status(404).json(err)
    }
    
}
module.exports = {
    postJob,
    editJob,
    deleteJob,
    getJob,
    getJobs,
    getMyJobs,
    acceptJob,
    rejectJob,
    applyJob,
    getAppliers
}