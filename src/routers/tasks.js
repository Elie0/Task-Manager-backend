const express = require('express')
const Task = require('../models/task')
const arraychecker = require('../utils/updatechecker')
const auth = require('../middleware/auth')
const router = new express.Router()




router.post('/tasks',auth,async (req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,                     // array1 = [...array2] now its not passed by reference. so if array2 changed array1 will not same goes for objects which is our req.body. so its like we are passing { task:"fdfdfsf",ststaus:true}
        Owner:req.user._id

    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})


router.patch('/tasks/:id',auth,async(req,res)=>{
    const allowedupdates = ['status','description']
    const taskupdates = Object.keys(req.body)
    const data = arraychecker(taskupdates,allowedupdates)

    if(data.length!==0)
    {
        return res.status(400).send({error:'these updates entries are not valid!!: '+data})
    }

    try{
        const task = await Task.findOne({_id:req.params.id,Owner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        taskupdates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
              return res.status(400).send()
    }

    
    
})
  
// get tasks?status=true/false
//GET /tasks?limit=10&skip=10
// GET /tasks/?sortBy=createdAt_desc
 router.get('/tasks', auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.status)
    {
        match.status = req.query.status === 'true' // hon eza kenit true bt redelle bool true w eza la2 bt reddele bool false lal match.param w eza ma ken fi query provided bt koun empty l match fa bt reddele kl l tasks false w true
    }
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        console.log(parts)
        sort[parts[0]] = parts[1] === 'desc' ? -1:1  // if desc sort will take the value of -1 otherwise will take 1
        console.log(parts[0])
    }

    try{
       
        const tasks = await req.user.populate({
            path:'task',
            match:match,                           // since match should be provided as an object match:{status:true/false}
            options:{                              // used for pagination and sorting

                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort:sort,
            }
           

        })
        res.send(tasks.task)
    }catch(e)
    {
        res.status(500).send()
    }
    
 })

 router.get('/tasks/:id',auth,async (req,res)=>{
    _id = req.params.id
    try{
          //const task = await Task.findById(_id)
          const task = await Task.findOne({_id,Owner:req.user._id})
          if(!task)
        {
           return res.status(404).send()
        }
        return res.send(task)
    }catch(e){
        return res.status(500).send()
    }

    
 })



 router.delete('/tasks/:id',auth, async (req,res)=>{
    try{
             const task = await Task.findOneAndDelete({_id:req.params.id,Owner:req.user._id})
             if(!task)
             {
                return res.status(404).send()
             }
             res.send(task)
    }catch(e){
        return res.status(500).send(e)
    }
 })
 module.exports = router


