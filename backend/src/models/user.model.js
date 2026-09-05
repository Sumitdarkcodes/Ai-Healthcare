const mongoose = require ("mongoose")    


const userSchema = new mongoose.Schema(
    {
    
    name : { 
            type : String,
            required : true,
            trim : true   // remove unnecessary space at start/end
           },

    email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
            },
    
    // We will NOT store the user's actual password. Before saving it to MongoDB,
    //  we'll use bcryptjs to hash it.        

    password : {                     
           type : String,
           required : true,
           minlength : 8
            },
            
    role : {
         type : String,
         enum :["patient","doctor","admin"], //only these value allowed
         default : "patient"
          },

         },
        
        {
    timestamps :true,       
         }
);

const User = mongoose.model("User",userSchema);

module.exports= User 