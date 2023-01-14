const path = require('path')
const dotenv=require('dotenv')
envPath = path.join(__dirname, '../config/dev.env')
dotenv.config({ path: envPath})   // hay l dotenv bt 3ouza kermel l sensitive data ma tb3aton 3a github mtl l api key
const express = require('express')
require('./db/mongoose')
const UserRoute = require('./routers/user')
const TaskRoute = require('./routers/tasks')
const app = express()
const port = process.env.PORT // || 3000  use npm i env-cmd to get critical info that may lead to security breaches like api key
const multer = require('multer')
console.log(process.env.PORT);

app.use(express.json())// automatically parse incoming json to object to use it directly with req.body 

app.use(UserRoute)

app.use(TaskRoute)

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})































































/*
without middleware: new request ->  run route handler

with middleware: new request -> do something ->run route handler

*/



// const pet = {
//     name:'hall'
// }

// pet.toJSON = function(){
//         console.log(this)
//     return {name:'not exposed'}
// }

// console.log(JSON.stringify(pet))


// const Task = require('./models/task')
// const User = require('./models/user')

/*const main = async () =>{
//  const task = await Task.findById('63bd88c927a1359d0be822ad')
//  await task.populate('Owner')
//  console.log(task.Owner)

const user = await User.findById('63bd813546f2acbd2d83ae7c')
await user.populate('task')
console.log(user.task)



}

main()*/
// const a = "hello:world"
// const s = a.split(':')
// console.log(s)




/*app.use((req,res,next)=>{
    if(req.method==='GET'){
         res.send('GET requests are not allowed')
    }else{
        next
    }
})*/

/*app.use((req,res,next)=>{
    res.status(503).send("maintenance comeback later")
})*/

// const upload = multer({
//     dest: 'images'  // destination where uploads will be saved
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// })