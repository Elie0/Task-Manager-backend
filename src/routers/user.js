const express = require('express')
const auth = require('../middleware/auth')
const arraychecker = require('../utils/updatechecker')
const User= require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const mail = require('../Emails/account')




router.post('/users',async (req,res)=>{           //post req used to create
    //console.log(req.body)  

    const user = new User(req.body)  // req.body contains the user sent data in order to save it*/*/*
    try{
          const token = await user.generateAuthToken()
          mail.sendwelcomeEmail(user.email,user.name)
          return res.status(201).send({user:user,token:token})
    }catch(e){
     res.status(500).send(e)
    }
    
 })

 router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        return res.send({user:user,token:token})
    }catch(e)
    {
       res.status(400).send()
    }
})

 router.patch('/users/me',auth,async (req,res)=>{
    const updates = Object.keys(req.body) // returns the keys(names) of the updates requested by user in an array
    const allowedUpdates = ['password','age','email','name']  // these the fields I allow user to update
 
  
    const DATA = arraychecker(updates,allowedUpdates)  // my fct from utils updatechecker    
    if(DATA.length!==0)
    {
      return res.status(400).send({error:'these updates entries are not valid!!: '+DATA})
    }
    try{
       const user =  await User.findById(req.user._id)
        updates.forEach((element)=> user[element] = req.body[element])                               //bracket notation means: user[element] = user.name  (whatever element is in loop
                                                                                                      // we updated manually and not using mongoose .findbyidandupdate fct to be able to use mangoose middleware before saving data, since by default it bypass this privilege
if(user.password!==req.user.password) // logout from all other devices if pass was changed
{
    user.tokens = user.tokens.filter((i) => i.token === req.token)
}
        await user.save()
        res.send(user)
       
    }catch(e){
           return res.status(400).send()
    }
 })





const upload = multer({
    //dest: 'Avatars',  // destination where uploads will be saved. Cannot use it if wanna save to mongodb
    limits:{
        fileSize:1000000 // in bytes, this is approx 1 MB
    },
    fileFilter(req,file,cb){
         if(!(file.originalname.endsWith('.jpg')||file.originalname.endsWith('.png')||file.originalname.endsWith('.jpeg')))
         {
            return cb(new Error('please upload an image!'))
         }
         cb(undefined,true)
    }

})

 router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{  //upload 'avatar' is the key to use in postman
         const buffer = await sharp(req.file.buffer).resize({width:250,height:500}).png().toBuffer()
         req.user.avatar = buffer // get the photo in binary
         await req.user.save()  // save the binary in mongodb
         res.send(req.user)
 },(error,req,res,next)=>{    //this is used to handle express middleware errors, like the one from upload.single
     res.status(400).send({error:error.message})
 })

 
 router.get('/users/avatar/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(! user || !user.avatar)
        {
            throw new error()
        }
          res.set('Content-Type','image/png')
          res.send(user.avatar)
    }catch{
        res.status(404).send('Not Found')

    }
 })
  
  
 




 router.get('/users/me',auth,async (req,res)=>{       //auth is the middleware used by requiring it
    //find({}) returns all available data in db
      res.send(req.user)

})



router.delete('/users/me',auth,async (req,res)=>{
    try{
             const user = await User.findByIdAndDelete(req.user._id)
             mail.sendgoodbye(user.email,user.name)
             res.status(200).send(user)
    }catch(e){
        return res.status(500).send(e)
    }
 })

 router.delete('/users/me/avatar',auth,async(req,res)=>{
            try{
                if(req.user.avatar)
                {
                    req.user.avatar = undefined
                    await req.user.save()
                    return res.status(200).send('Avatar succesfully deleted')
                }

                return res.send('Already no avatar to remove')

                
            }catch(e){
                   res.send(e)
            }
            
    
 })


 
router.post('/users/logout',auth,async(req,res)=>{
    try{
         req.user.tokens = req.user.tokens.filter((i)=>{       // i is every element in the array tokens. and the elements of token are objects. so with this, we return the array with all the tokens of other devices, and we remove token of current device, therefore we logout
                 return i.token !== req.token
         })
         await req.user.save()
         res.send()
    }catch(e){
          res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
         //req.user.tokens.splice(0,req.user.tokens.length) // deleting array elements splice(index,nb of items wish to remove) or splice(index,nb of items wish to remove,item1 to add at that index,item2,itemx....)
         req.user.tokens = []
         await req.user.save()
          return res.send()
    }catch(e){
                return res.status(400).send(e)
    }
})


 module.exports = router    
 