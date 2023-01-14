const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const passwordvalidate = require('password-validator')
const Task = require('./task')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    
    name:{
             type: String,
             required:true,
             trim:true,  //to remove the white spaces from the strings
             
    },
    email:{
            type:String,
            unique:true, // ensures that mail was not used before
            required:true,
            lowercase:true, // always convert name to lowercase
            trim:true, // like " etarou@ndu.edu.lb      " it removes the empty space
            validate(x){    // x takes the value of email
                if(!validator.isEmail(x))
                {
                    throw new Error('Email is invalid')
                }
            }
    },
    age:{
          type:Number,
          default:0, // if age not provided it becomes 0 by deault
          validate(x){
            if(x<0)
            {
                throw new Error('Age must be positive!')
            }
          }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(x){
           const requirements = new passwordvalidate()
           requirements.is().min(8) 
           .has().uppercase().has().lowercase() 
           .has().digits(2).has().not().spaces() 
           if(!requirements.validate(x)===true)
           {
            throw new Error('your password missses these requirements: '+ requirements.validate(x, { list: true }))
           }
        }
    },avatar:{            //this is added if I want to save profile pics for users
            
        type:Buffer,   // photo saved in binary
}, 
    tokens:[{                //using array of objects since maybe a user will log in from multiple devices, each device will have its own token
        token:{
            type:String,
            required:true
        }
    }]

    

   
 
}, {                  //another argument
   timestamps: true
})

userSchema.virtual('task',{    // a virtual way to let mongoose know that user is owned by a task. you can now use user.populate('task')
    ref:'Task',
    localField:'_id', 
    foreignField:'Owner'
})

// a new schema called findByCredentials created by me. beware always this must come before the userSchema.pre()
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email:email})
    if(!user)
    {
        throw new error('unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch)
    {
        throw new error('Unable to login')
    }
    return user
}

//a schema to generate tokens: here its method not statics, since we wanna use it on the instance Object of User
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_Token_secret_key)   //second param is the secret, you can use whatever you want, first param is something that uniquely identify user, which is the _id from mongo db
    user.tokens.push({token:token})  //{token} destructuring
    await user.save()
    return token

}

userSchema.methods.toJSON = function(){  // toJSON will always apply the changes even if not called. whatever user json passed will be validated according to this fct
    const user = this
    const userObject = user.toObject() // mongoose fct that let us have user objects in db to manipulate them
    delete userObject.password   
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}



// hash the user's password before saving to database schema
userSchema.pre('save',async function(next){                                                                                  // this fct will be executed before the save condition in user route post method
  const user = this                                                                                                         // gives reference about the individual user going to be saved
  if(user.isModified('password')){                                                 // will hash when password is updated or first time added
        user.password = await bcrypt.hash(user.password,8)
  }
  


  next()                                                                                                                   // used to tell that we ended writing code before the save user, so we will not save the user ever
})


//Delete user tasks when user is removed:

userSchema.pre('remove',async function(next){
    const user = this
    Task.deleteMany({Owner:user._id})
    next()

})



const User = mongoose.model('User',userSchema)
User.createIndexes(); // always do it after initializing a model, to ensure creating indexes





module.exports = User

