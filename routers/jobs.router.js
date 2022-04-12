const clientAuth = require('../middlewares/client-auth.mw')
const adminAuth = require('../middlewares/admin-auth.mw')
const express = require('express')
const {
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
} = require('../controllers/jobs.controller')
const jobsRouter = express.Router()

jobsRouter.post('/post-job',clientAuth,postJob)
jobsRouter.patch('/edit-job/:id',clientAuth,editJob)
jobsRouter.delete('/delete-job/:id',clientAuth,deleteJob)
jobsRouter.get('/get-job/:id',getJob)
jobsRouter.get('/get-jobs',getJobs)
jobsRouter.get('/get-my-jobs',clientAuth,getMyJobs)
jobsRouter.patch('/accept-job/:id',adminAuth,acceptJob)
jobsRouter.delete('/reject-job/:id',adminAuth,rejectJob)
jobsRouter.post('/apply-job/:id',clientAuth,applyJob)
jobsRouter.get('/get-appliers/:id',getAppliers)

module.exports = jobsRouter