require('../src/db/mongoose')
const User = require('../src/models/user')

//63b7fcbb121262fd5c98e7a3

/*User.findByIdAndUpdate('63b7fcbb121262fd5c98e7a3',{age:1}).then((result)=>{

    console.log(result)
    return User.countDocuments({age:21})
}).then((result2)=>{
    console.log('nb of users having age 21: '+ result2)
}).catch((e)=>{
    return console.log(e)
})*/

const updateandcount = async(id,age) =>{

      const user = await User.findByIdAndUpdate(id,{age:age})
      const count = await User.countDocuments({age:age})
      return [count,user]
}

updateandcount('63b7fcbb121262fd5c98e7a3',24).then((results)=>{
    console.log('nb of users having age 21: '+ results[0])
    console.log('updated user: '+ results[1])
}).catch((e)=>{
    console.log(e)
})