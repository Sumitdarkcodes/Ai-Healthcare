const User = require ("../models/user.model");

const bcrypt = require ("bcryptjs");

const jwt = require ("jsonwebtoken");


const registerUser = async (req,res) => {


    const { email, name, password } = req.body;
      
    //  Did the user provide all required information?

    if (!email || !name || !password)
    {
        return res.status(400).json({

            message : "Email, Name and Password are required "
        });
    }

    // Does this email already exist in MongoDB?

    const existingUser = await User.findOne({ email });

    if (existingUser)
    {
        return res.status(409).json ({

            message : "User with this email already exists "
        });
    }

    // Now the next step is password hashing.

    const hashedPassword = await bcrypt.hash(password,10);

    // now we are creating account for registerUser 

    const newAccount = new User ({

        name,
        email,
        password : hashedPassword
    });

    await newAccount.save();

    return res.status(201).json({

        message : "User registered successfully ",

        userId : newAccount._id
    });


};

const registerAdmin = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Email, Name and Password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        await newAdmin.save();

        return res.status(201).json({
            message: "Admin registered successfully",
            userId: newAdmin._id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req,res) => {

    try 
    {
     const { email,password } = req.body;

     //    1. Validate input
      
     if (!email || !password)
       {
         return res.status(400).json
         ({

            message : "Email and Password are required"
         }) ;
        }

     //   2. Find User
     
     const user = await User.findOne({email})

     if(!user)
     {
        return res.status(401).json
        ({
            message : "Email and Password are invalid"
        })
     }
     
     //  3. Compare password

     const isPasswordCorrect = await bcrypt.compare (
        password,
        user.password
     );

     if(!isPasswordCorrect)
     {
        return res.status(401).json
        ({
             message : "Invalid Password"
        });
     }

     //  4. Generate JWT

     const token = jwt.sign 
     ({
        userId : user._id,
        email : user.email,
        role  : user.role
     },
       process.env.JWT_SECRET,
       {
        expiresIn : "1d"
       }
      );

     // 4.1  JWT(token) save in cookie
     
     res.cookie("token",token)

     

      //  5. Send response

      return res.status(200).json
      ({
        message : "Login successful"
      });

    }

    catch (error)
    {
     console.error(error);

     return res.status(500).json
     ({
        message : "Internal server error"
     });

    }

};

const getProfile = async (req,res) => {

    try 
    {
        const user = await User.findById ( req.user.userId)
          
        .select("-password");     // Don't include the password in the result.

        if(!user) 
        {
            return res.status(404).json
            ({
               message : " User not Found" 
            })
        }
          return res.status(200).json 
          ({
             message : " Profile fetched sucessfully",
             user
          });

    } 

    catch(error)
    {
        console.error(error);

        return res.status(500).json
        ({
          message : " Internal server error "
        });
    }
};


module.exports = {registerUser, loginUser, getProfile,registerAdmin};