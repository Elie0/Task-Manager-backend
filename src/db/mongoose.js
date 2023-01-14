const mongoose = require('mongoose')
const connectionurl = process.env.MongooseConnectionUrl //here you provide database name with the url unlike mongodb inside client.connect
mongoose.set('strictQuery', false)
mongoose.connect(connectionurl)





/*const me = new User({
     name:'E',
     age:21,
     email:'etarou@ndu.edu.lb    ',
     password:'eliebek'
})

me.save().then(()=>{
     console.log(me)
}).catch((error)=>{
     console.log(error)
})*/

/*const product = new Task({
    status:false,
    description:'be a king'}
)


product.save().then((results)=>{
    console.log(results)
}).catch((error)=>
{
   console.log(error)
})*/

