const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req,res,next) =>{
   try{
          const token = req.header('Authorization').replace('Bearer ','')      //to remove Bearer
          //console.log(token)
          const decoded = jwt.verify(token,'Iameliebekaro')  // it should match our secret phrase iameliearobek so we know its a valid token
          //console.log(decoded)
          const user = await User.findOne({_id:decoded._id,'tokens.token':token})  //tokens.token a special syntax in Mongoose for accessing a property on an array of objects to say "look for an objet in the tokens array and check it's token property against this value so it will look up all the tokens object inside the array
          //console.log(user)
          if( !user ){
            throw new Error()
          }
          req.user = user // we saved the user in the request body in order to give it only to its logged in user and not allow him to access the other docs
          req.token = token
          //console.log(req.user)
          next()
   }catch(e){
        res.status(401).send({error:'please authenticate'})     
   }
}
module.exports = auth