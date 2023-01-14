
const check = (userarray,array2)=>{
    var data = []
    for(let i=0;i<userarray.length;i++)
    {
     for(let j=0;j<array2.length;j++)
     {
         if(!(array2.includes(userarray[i])))
         {
             data.push(userarray[i])
             break
             
         }
     }
    }  
    return data
}

module.exports = check