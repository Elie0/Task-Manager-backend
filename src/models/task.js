const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    status:{
        type:Boolean,
        default:false,
},

description:{
 type:String,
 required:true,
 trim:true,

},

Owner:{
 type:mongoose.Schema.Types.ObjectId, // tells that data stored should be a mongoode object with an id like User
 required:true,
 ref:'User' // creates a reference to User model therefore the object id will know its destination
}

},{
    timestamps:true
})
const Task = mongoose.model('Task',TaskSchema)
Task.createIndexes(); // always do it after initializing a model, to ensure creating indexes
module.exports = Task