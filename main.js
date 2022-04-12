const express = require('express')

const sequelize = require('./database/connection')

const adminRouter = require('./routers/admin.router')
const clientRouter = require('./routers/client.router')
const jobsRouter = require('./routers/jobs.router')
const categoryRouter = require('./routers/category.router')
const bodyParser = require('body-parser')

const Client = require('./database/models/client.model')
const Job = require('./database/models/job.model')
const ClientJob = require('./database/models/client-job.model')
const category = require('./database/models/category.model')
const Admin = require('./database/models/admin.model')

require('dotenv').config({
    path:'./vars.env'
})

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/admin',adminRouter)
app.use('/client',clientRouter)
app.use('/jobs',jobsRouter)
app.use('/category',categoryRouter)


Client.hasMany(Job);
Job.belongsTo(Client, { constraints: true, onDelete: 'CASCADE' });

Client.belongsToMany(Job,{through:ClientJob,constraints:true,onDelete:'CASCADE'})
Job.belongsToMany(Client,{through:ClientJob,constraints:true,onDelete:'CASCADE'})

category.hasMany(Job,{constraints:true,onDelete:'CASCADE'});
Job.belongsTo(category,{ constraints: true,onDelete:'CASCADE'})


sequelize.sync().then(() => {
    return Admin.findAll()
}).then(admins=>{
    if(admins.length == 0){
        return Admin.create({
            firstName:"new",
            lastName:"admin",
            email:"newadmin@gmail.com",
            password:"123456"
        })
    }else{
        return admins
    }
}).then(()=>{
    app.listen(port,()=>{
        console.log(`connected on port ${port}`)
    })
}).catch(err => {
    console.log(err);
});